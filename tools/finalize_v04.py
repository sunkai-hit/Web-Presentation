from __future__ import annotations

import base64
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import time
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROTO = ROOT / "prototype" / "full-v0.4"
RELEASE = ROOT / "release" / "v0.4"
QA = ROOT / "qa"
TITLE = "数智健康OPC国际人才社区_Web_Presentation_V0.4"
HTML_NAME = f"{TITLE}.html"
ZIP_NAME = f"{TITLE}.zip"

CSS_FILES = [PROTO / "css" / f"part-{i}.css" for i in range(1, 5)]
SCREEN_FILES = [
    PROTO / "screens" / "screens-01-05.js",
    PROTO / "screens" / "screens-06-10.js",
    PROTO / "screens" / "screens-11-15.js",
    PROTO / "screens" / "screens-16-20.js",
]
APP_FILE = PROTO / "app.js"
PHOTO = PROTO / "assets" / "opc-reveal.jpg"


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def require_files() -> None:
    required = [PROTO / "index.html", APP_FILE, PHOTO, *CSS_FILES, *SCREEN_FILES]
    missing = [str(p.relative_to(ROOT)) for p in required if not p.exists()]
    if missing:
        raise SystemExit("Missing V0.4 source files: " + ", ".join(missing))


def audit_sources() -> dict:
    index = (PROTO / "index.html").read_text(encoding="utf-8")
    refs = re.findall(r'(?:href|src)="([^"]+)"', index)
    local_refs = [r for r in refs if not re.match(r"^[a-z]+://", r)]
    missing_refs = [r for r in local_refs if not (PROTO / r).exists()]

    screens_text = "\n".join(p.read_text(encoding="utf-8") for p in SCREEN_FILES)
    ids = re.findall(r'data-screen=\\?"(\d{2})\\?"', screens_text)
    if not ids:
        ids = re.findall(r'data-screen=["\\]+(\d{2})', screens_text)
    unique_ids = sorted(set(ids))

    # Syntax check every JS source with node when available.
    node = shutil.which("node")
    syntax = {}
    if node:
        for p in [*SCREEN_FILES, APP_FILE]:
            proc = subprocess.run([node, "--check", str(p)], capture_output=True, text=True)
            syntax[str(p.relative_to(ROOT))] = proc.returncode == 0
            if proc.returncode:
                raise SystemExit(proc.stderr)

    expected = [f"{i:02d}" for i in range(1, 21)]
    if unique_ids != expected:
        raise SystemExit(f"Screen ID audit failed: {unique_ids}")
    if missing_refs:
        raise SystemExit(f"Missing index refs: {missing_refs}")

    return {
        "index_refs": local_refs,
        "screen_ids": unique_ids,
        "js_syntax": syntax,
        "photo_bytes": PHOTO.stat().st_size,
    }


def build_single_html() -> Path:
    RELEASE.mkdir(parents=True, exist_ok=True)
    index = (PROTO / "index.html").read_text(encoding="utf-8")

    css = "\n\n".join(p.read_text(encoding="utf-8") for p in CSS_FILES)
    for i in range(1, 5):
        index = re.sub(
            rf'<link rel="stylesheet" href="css/part-{i}\.css"\s*/?>',
            "",
            index,
        )
    index = index.replace("</head>", f"<style>\n{css}\n</style>\n</head>")

    photo64 = base64.b64encode(PHOTO.read_bytes()).decode("ascii")
    photo_data = f"data:image/jpeg;base64,{photo64}"

    for p in SCREEN_FILES:
        rel = p.relative_to(PROTO).as_posix()
        js = p.read_text(encoding="utf-8").replace("assets/opc-reveal.jpg", photo_data)
        pattern = rf'<script src="{re.escape(rel)}"></script>'
        index = re.sub(pattern, lambda _m, js=js: f"<script>\n{js}\n</script>", index)

    app = APP_FILE.read_text(encoding="utf-8")
    index = re.sub(
        r'<script src="app\.js"></script>',
        lambda _m: f"<script>\n{app}\n</script>",
        index,
    )

    # Guard against accidental external runtime dependencies.
    external = re.findall(r'(?:href|src)="(https?://[^"]+)"', index)
    if external:
        raise SystemExit(f"External dependency detected in final HTML: {external}")

    out = RELEASE / HTML_NAME
    out.write_text(index, encoding="utf-8")
    return out


def render_contact_sheet(html: Path) -> Path | None:
    chrome = shutil.which("google-chrome") or shutil.which("google-chrome-stable") or shutil.which("chromium") or shutil.which("chromium-browser")
    if not chrome:
        print("Chrome not found; contact sheet rendering skipped", file=sys.stderr)
        return None

    try:
        from PIL import Image, ImageDraw
    except Exception as exc:
        print(f"Pillow unavailable ({exc}); contact sheet rendering skipped", file=sys.stderr)
        return None

    temp = QA / ".v0.4-render"
    if temp.exists():
        shutil.rmtree(temp)
    temp.mkdir(parents=True)
    uri = html.resolve().as_uri()

    shots = []
    for i in range(1, 21):
        shot = temp / f"screen-{i:02d}.png"
        url = f"{uri}#{i:02d}"
        cmd = [
            chrome,
            "--headless=new",
            "--disable-gpu",
            "--no-sandbox",
            "--hide-scrollbars",
            "--window-size=1920,1080",
            "--force-device-scale-factor=1",
            "--virtual-time-budget=1200",
            f"--screenshot={shot}",
            url,
        ]
        proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if proc.returncode != 0 or not shot.exists():
            raise SystemExit(f"Chrome render failed for screen {i:02d}: {proc.stderr[-1500:]}")
        shots.append(shot)

    cols, rows = 5, 4
    thumb_w, thumb_h = 348, 196
    gap, label_h = 12, 24
    sheet_w = cols * thumb_w + (cols + 1) * gap
    sheet_h = rows * (thumb_h + label_h) + (rows + 1) * gap
    sheet = Image.new("RGB", (sheet_w, sheet_h), "#e8ece8")
    draw = ImageDraw.Draw(sheet)

    for idx, shot in enumerate(shots):
        row, col = divmod(idx, cols)
        x = gap + col * (thumb_w + gap)
        y = gap + row * (thumb_h + label_h + gap)
        im = Image.open(shot).convert("RGB")
        im = im.resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)
        sheet.paste(im, (x, y))
        draw.text((x + 5, y + thumb_h + 4), f"SCREEN {idx + 1:02d}", fill="#264d40")

    out = QA / "contact-sheet-v0.4.jpg"
    sheet.save(out, "JPEG", quality=86, optimize=True)
    shutil.rmtree(temp)
    return out


def write_release_docs(html: Path, contact: Path | None) -> Path:
    readme = RELEASE / "README.md"
    readme.write_text(
        "# 数智健康 OPC 国际人才社区 Web Presentation V0.4\n\n"
        "本目录为 V0.4 正式发布基线。\n\n"
        "- 单文件 HTML：可离线直接打开，20 屏，样式、交互与揭牌图片均内嵌。\n"
        "- ZIP：包含正式 HTML、README 与包内 HTML 校验值。\n"
        "- SHA256SUMS.txt：记录正式 HTML、ZIP 及 QA Contact Sheet 的校验值。\n\n"
        "关键基线页 Screen 01 / 06 / 08 / 12 保持用户确认版本。\n",
        encoding="utf-8",
    )

    inner_checks = RELEASE / "HTML-SHA256.txt"
    inner_checks.write_text(f"{sha256(html)}  {HTML_NAME}\n", encoding="utf-8")

    zip_path = RELEASE / ZIP_NAME
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        z.write(html, HTML_NAME)
        z.write(readme, "README.md")
        z.write(inner_checks, "HTML-SHA256.txt")

    lines = [
        f"{sha256(html)}  {HTML_NAME}",
        f"{sha256(zip_path)}  {ZIP_NAME}",
    ]
    if contact and contact.exists():
        lines.append(f"{sha256(contact)}  qa/{contact.name}")
    (RELEASE / "SHA256SUMS.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")

    audit = {
        "generated_at_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "html": {"path": str(html.relative_to(ROOT)), "bytes": html.stat().st_size, "sha256": sha256(html)},
        "zip": {"path": str(zip_path.relative_to(ROOT)), "bytes": zip_path.stat().st_size, "sha256": sha256(zip_path)},
        "contact_sheet": None if not contact else {"path": str(contact.relative_to(ROOT)), "bytes": contact.stat().st_size, "sha256": sha256(contact)},
    }
    (QA / "release-build-audit-v0.4.json").write_text(json.dumps(audit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return zip_path


def main() -> None:
    require_files()
    source_audit = audit_sources()
    (QA / "source-reference-audit-v0.4.json").write_text(json.dumps(source_audit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    html = build_single_html()
    contact = render_contact_sheet(html)
    zip_path = write_release_docs(html, contact)
    print(json.dumps({
        "html": str(html.relative_to(ROOT)),
        "html_sha256": sha256(html),
        "zip": str(zip_path.relative_to(ROOT)),
        "zip_sha256": sha256(zip_path),
        "contact_sheet": None if not contact else str(contact.relative_to(ROOT)),
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
