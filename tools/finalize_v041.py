from __future__ import annotations

import base64
import hashlib
import io
import json
import re
import shutil
import subprocess
import time
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROTO = ROOT / 'prototype' / 'full-v0.4.1'
RELEASE = ROOT / 'release' / 'v0.4.1'
QA = ROOT / 'qa'
TITLE = '数智健康OPC国际人才社区_Web_Presentation_V0.4.1'
STANDALONE_NAME = f'{TITLE}_Standalone.html'
ZIP_NAME = f'{TITLE}.zip'
CSS_FILES = [PROTO / 'css' / f'part-{i}.css' for i in range(1, 6)]
SCREEN_FILES = [
    PROTO/'screens'/'screens-01-05.js',
    PROTO/'screens'/'screens-06-10.js',
    PROTO/'screens'/'screens-11-15.js',
    PROTO/'screens'/'screens-16-20.js',
]
PATCH_JS = PROTO / 'screens' / 'v0.4.1-patch.js'
PHOTO = PROTO / 'assets' / 'opc-reveal.jpg'
PHOTO_PNG = PROTO / 'assets' / 'opc-reveal.png'
APP_FILE = PROTO / 'app.js'
MIN_PHOTO_WIDTH = 1000
MIN_PHOTO_HEIGHT = 600


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b''):
            h.update(chunk)
    return h.hexdigest()


def validate_photo_source():
    """Validate the committed Screen 02 JPEG without modifying or restoring it."""
    from PIL import Image

    if not PHOTO.exists():
        raise SystemExit(f'Missing Screen 02 source photo: {PHOTO.relative_to(ROOT)}')
    if PHOTO.stat().st_size < 10_000:
        raise SystemExit('Screen 02 source photo is unexpectedly small.')

    try:
        with Image.open(PHOTO) as im:
            im.load()
            info = {
                'format': im.format,
                'width': im.width,
                'height': im.height,
                'mode': im.mode,
            }
    except Exception as exc:
        raise SystemExit(f'Screen 02 source photo cannot be decoded: {exc}')

    if info['format'] != 'JPEG':
        raise SystemExit(f"Screen 02 source photo must be JPEG, got {info['format']}")
    if info['width'] < MIN_PHOTO_WIDTH or info['height'] < MIN_PHOTO_HEIGHT:
        raise SystemExit(
            f"Screen 02 source photo resolution is too low: "
            f"{info['width']}x{info['height']} < {MIN_PHOTO_WIDTH}x{MIN_PHOTO_HEIGHT}"
        )
    return info


def ensure_photo_png():
    """Create a broadly compatible PNG copy from the validated high-resolution JPEG."""
    from PIL import Image

    with Image.open(PHOTO) as im:
        im.load()
        if im.mode not in ('RGB', 'RGBA'):
            im = im.convert('RGB')
        im.save(PHOTO_PNG, 'PNG', optimize=True)
    with Image.open(PHOTO_PNG) as check:
        check.verify()


def require_files():
    required = [PROTO/'index.html', APP_FILE, PATCH_JS, PHOTO, PHOTO_PNG, *CSS_FILES, *SCREEN_FILES]
    missing = [str(p.relative_to(ROOT)) for p in required if not p.exists()]
    if missing:
        raise SystemExit('Missing V0.4.1 source files: ' + ', '.join(missing))


def audit_sources():
    from PIL import Image

    index = (PROTO/'index.html').read_text(encoding='utf-8')
    refs = re.findall(r'(?:href|src)="([^"]+)"', index)
    local = [r for r in refs if not re.match(r'^[a-z]+://', r)]
    missing = [r for r in local if not (PROTO/r).exists()]
    if missing:
        raise SystemExit(f'Missing index refs: {missing}')

    screens = '\n'.join(p.read_text(encoding='utf-8') for p in SCREEN_FILES)
    ids = re.findall(r'data-screen=\\?"(\d{2})\\?"', screens) or re.findall(r'data-screen=["\\]+(\d{2})', screens)
    unique = sorted(set(ids))
    expected = [f'{i:02d}' for i in range(1, 21)]
    if unique != expected:
        raise SystemExit(f'Screen ID audit failed: {unique}')

    syntax = {}
    node = shutil.which('node')
    if node:
        for p in [*SCREEN_FILES, PATCH_JS, APP_FILE]:
            proc = subprocess.run([node, '--check', str(p)], capture_output=True, text=True)
            syntax[str(p.relative_to(ROOT))] = proc.returncode == 0
            if proc.returncode:
                raise SystemExit(proc.stderr)

    with Image.open(PHOTO) as src:
        src.load()
        source_info = {'format': src.format, 'width': src.width, 'height': src.height, 'mode': src.mode}
    with Image.open(PHOTO_PNG) as im:
        im.load()
        photo_info = {'format': im.format, 'width': im.width, 'height': im.height, 'mode': im.mode}

    if photo_info['width'] != source_info['width'] or photo_info['height'] != source_info['height']:
        raise SystemExit('Screen 02 PNG dimensions do not match source JPEG.')

    return {
        'index_refs': local,
        'screen_ids': unique,
        'js_syntax': syntax,
        'photo_bytes': PHOTO.stat().st_size,
        'photo_source': source_info,
        'photo_png_bytes': PHOTO_PNG.stat().st_size,
        'photo_png': photo_info,
        'photo_source_sha256': sha256(PHOTO),
    }


def build_standalone():
    from PIL import Image

    RELEASE.mkdir(parents=True, exist_ok=True)
    html = (PROTO/'index.html').read_text(encoding='utf-8')

    for p in CSS_FILES:
        rel = p.relative_to(PROTO).as_posix()
        css = p.read_text(encoding='utf-8')
        html = re.sub(
            rf'<link rel="stylesheet" href="{re.escape(rel)}"\s*/?>',
            lambda _m, css=css: f'<style>\n{css}\n</style>',
            html,
        )

    for p in [*SCREEN_FILES, PATCH_JS, APP_FILE]:
        rel = p.relative_to(PROTO).as_posix()
        js = p.read_text(encoding='utf-8')
        html = re.sub(
            rf'<script src="{re.escape(rel)}"></script>',
            lambda _m, js=js: f'<script>\n{js}\n</script>',
            html,
        )

    png_bytes = PHOTO_PNG.read_bytes()
    photo_uri = 'data:image/png;base64,' + base64.b64encode(png_bytes).decode('ascii')
    html = html.replace('assets/opc-reveal.jpg', photo_uri).replace('assets/opc-reveal.png', photo_uri)

    m = re.search(r'data:image/png;base64,([A-Za-z0-9+/=]+)', html)
    if not m:
        raise SystemExit('Embedded PNG data URI not found.')
    decoded = base64.b64decode(m.group(1), validate=True)
    if decoded != png_bytes:
        raise SystemExit('Embedded PNG bytes do not match source PNG.')
    with Image.open(io.BytesIO(decoded)) as im:
        im.verify()

    leftover = re.findall(r'(?:href|src)="([^"#]+)"', html)
    local_left = [x for x in leftover if not x.startswith(('data:', 'http://', 'https://'))]
    if local_left:
        raise SystemExit(f'Uninlined local dependency detected: {local_left}')

    markers = [
        'V0.4.1 readability and layout refinement patch',
        'data:image/png;base64,',
        '按平台实时统计',
        'AI 知识库建设项目',
    ]
    missing = [m for m in markers if m not in html]
    if missing:
        raise SystemExit(f'Standalone marker audit failed: {missing}')

    out = RELEASE/STANDALONE_NAME
    out.write_text(html, encoding='utf-8')
    return out


def render_contact_sheet(html):
    chrome = (
        shutil.which('google-chrome')
        or shutil.which('google-chrome-stable')
        or shutil.which('chromium')
        or shutil.which('chromium-browser')
    )
    if not chrome:
        raise SystemExit('Chrome/Chromium not found')

    from PIL import Image, ImageDraw

    temp = QA/'.v0.4.1-render'
    if temp.exists():
        shutil.rmtree(temp)
    temp.mkdir(parents=True)
    uri = html.resolve().as_uri()
    shots = []

    for i in range(1, 21):
        shot = temp/f'screen-{i:02d}.png'
        cmd = [
            chrome,
            '--headless=new',
            '--disable-gpu',
            '--no-sandbox',
            '--hide-scrollbars',
            '--window-size=1920,1080',
            '--force-device-scale-factor=1',
            '--virtual-time-budget=1800',
            f'--screenshot={shot}',
            f'{uri}#{i:02d}',
        ]
        proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if proc.returncode != 0 or not shot.exists():
            raise SystemExit(f'Chrome render failed for screen {i:02d}: {proc.stderr[-1500:]}')
        shots.append(shot)

    cols, rows = 5, 4
    tw, th, gap, lh = 348, 196, 12, 24
    sw = cols*tw + (cols+1)*gap
    sh = rows*(th+lh) + (rows+1)*gap
    sheet = Image.new('RGB', (sw, sh), '#e8ece8')
    draw = ImageDraw.Draw(sheet)

    for idx, shot in enumerate(shots):
        row, col = divmod(idx, cols)
        x = gap + col*(tw+gap)
        y = gap + row*(th+lh+gap)
        im = Image.open(shot).convert('RGB').resize((tw, th), Image.Resampling.LANCZOS)
        sheet.paste(im, (x, y))
        draw.text((x+5, y+th+4), f'SCREEN {idx+1:02d}', fill='#264d40')

    out = QA/'contact-sheet-v0.4.1.jpg'
    sheet.save(out, 'JPEG', quality=88, optimize=True)
    shutil.rmtree(temp)
    return out


def package(html, contact):
    readme = RELEASE/'README.md'
    readme.write_text(
        '# 数智健康 OPC 国际人才社区 Web Presentation V0.4.1\n\n'
        'V0.4.1 为基于 V0.4 的可读性与布局精修版本，原 V0.4 文件保持不覆盖。\n\n'
        '- Standalone HTML：20 屏单文件离线演示版，CSS、JS 与揭牌照片均内嵌。\n'
        '- Screen 02 照片机制：直接使用仓库中提交的高分辨率 `opc-reveal.jpg`，构建时验证分辨率与可解码性，再生成 PNG；Standalone 内嵌经过解码校验的 PNG Data URI。\n'
        '- 模块化源码：位于 `prototype/full-v0.4.1/`。\n'
        '- 主要调整：Screen 02 / 09 / 14 / 16，以及全局字号与总分结构收拢。\n'
        '- Contact Sheet：`qa/contact-sheet-v0.4.1.jpg`。\n',
        encoding='utf-8',
    )

    inner = RELEASE/'HTML-SHA256.txt'
    inner.write_text(f'{sha256(html)}  {STANDALONE_NAME}\n', encoding='utf-8')

    zp = RELEASE/ZIP_NAME
    with zipfile.ZipFile(zp, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        z.write(html, STANDALONE_NAME)
        z.write(readme, 'README.md')
        z.write(inner, 'HTML-SHA256.txt')

    lines = [
        f'{sha256(html)}  {STANDALONE_NAME}',
        f'{sha256(zp)}  {ZIP_NAME}',
        f'{sha256(contact)}  qa/{contact.name}',
    ]
    (RELEASE/'SHA256SUMS.txt').write_text('\n'.join(lines) + '\n', encoding='utf-8')

    audit = {
        'generated_at_utc': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
        'standalone': {
            'path': str(html.relative_to(ROOT)),
            'bytes': html.stat().st_size,
            'sha256': sha256(html),
        },
        'zip': {
            'path': str(zp.relative_to(ROOT)),
            'bytes': zp.stat().st_size,
            'sha256': sha256(zp),
        },
        'contact_sheet': {
            'path': str(contact.relative_to(ROOT)),
            'bytes': contact.stat().st_size,
            'sha256': sha256(contact),
        },
        'screen02_photo': {
            'source_path': str(PHOTO.relative_to(ROOT)),
            'source_bytes': PHOTO.stat().st_size,
            'source_sha256': sha256(PHOTO),
            'png_path': str(PHOTO_PNG.relative_to(ROOT)),
            'png_bytes': PHOTO_PNG.stat().st_size,
            'png_sha256': sha256(PHOTO_PNG),
            'standalone_mime': 'image/png',
        },
    }
    (QA/'release-build-audit-v0.4.1.json').write_text(
        json.dumps(audit, ensure_ascii=False, indent=2) + '\n',
        encoding='utf-8',
    )
    return zp


def main():
    QA.mkdir(parents=True, exist_ok=True)
    source_info = validate_photo_source()
    print(f"Validated Screen 02 photo: {source_info['width']}x{source_info['height']} {source_info['format']}")
    ensure_photo_png()
    require_files()

    audit = audit_sources()
    (QA/'source-reference-audit-v0.4.1.json').write_text(
        json.dumps(audit, ensure_ascii=False, indent=2) + '\n',
        encoding='utf-8',
    )

    html = build_standalone()
    contact = render_contact_sheet(html)
    zp = package(html, contact)
    print(json.dumps({
        'standalone': str(html.relative_to(ROOT)),
        'standalone_sha256': sha256(html),
        'zip': str(zp.relative_to(ROOT)),
        'zip_sha256': sha256(zp),
        'contact_sheet': str(contact.relative_to(ROOT)),
        'screen02_photo': str(PHOTO_PNG.relative_to(ROOT)),
        'screen02_source_resolution': f"{source_info['width']}x{source_info['height']}",
    }, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
