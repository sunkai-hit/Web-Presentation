from __future__ import annotations

import base64
import hashlib
import json
import re
import shutil
import subprocess
import sys
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
SCREEN_FILES = [PROTO/'screens'/'screens-01-05.js',PROTO/'screens'/'screens-06-10.js',PROTO/'screens'/'screens-11-15.js',PROTO/'screens'/'screens-16-20.js']
PATCH_JS = PROTO / 'screens' / 'v0.4.1-patch.js'
PHOTO = PROTO / 'assets' / 'opc-reveal.jpg'
APP_FILE = PROTO / 'app.js'

def sha256(path: Path) -> str:
    h=hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda:f.read(1024*1024),b''): h.update(chunk)
    return h.hexdigest()

def require_files():
    required=[PROTO/'index.html',APP_FILE,PATCH_JS,PHOTO,*CSS_FILES,*SCREEN_FILES]
    missing=[str(p.relative_to(ROOT)) for p in required if not p.exists()]
    if missing: raise SystemExit('Missing V0.4.1 source files: '+', '.join(missing))

def audit_sources():
    index=(PROTO/'index.html').read_text(encoding='utf-8')
    refs=re.findall(r'(?:href|src)="([^"]+)"',index)
    local=[r for r in refs if not re.match(r'^[a-z]+://',r)]
    missing=[r for r in local if not (PROTO/r).exists()]
    if missing: raise SystemExit(f'Missing index refs: {missing}')
    screens='\n'.join(p.read_text(encoding='utf-8') for p in SCREEN_FILES)
    ids=re.findall(r'data-screen=\\?"(\d{2})\\?"',screens) or re.findall(r'data-screen=["\\]+(\d{2})',screens)
    unique=sorted(set(ids)); expected=[f'{i:02d}' for i in range(1,21)]
    if unique!=expected: raise SystemExit(f'Screen ID audit failed: {unique}')
    syntax={}; node=shutil.which('node')
    if node:
        for p in [*SCREEN_FILES,PATCH_JS,APP_FILE]:
            proc=subprocess.run([node,'--check',str(p)],capture_output=True,text=True); syntax[str(p.relative_to(ROOT))]=proc.returncode==0
            if proc.returncode: raise SystemExit(proc.stderr)
    if PHOTO.stat().st_size<1000: raise SystemExit('V0.4.1 unveiling photo is invalid or too small.')
    return {'index_refs':local,'screen_ids':unique,'js_syntax':syntax,'photo_bytes':PHOTO.stat().st_size}

def build_standalone():
    RELEASE.mkdir(parents=True,exist_ok=True)
    html=(PROTO/'index.html').read_text(encoding='utf-8')
    for p in CSS_FILES:
        rel=p.relative_to(PROTO).as_posix(); css=p.read_text(encoding='utf-8')
        html=re.sub(rf'<link rel="stylesheet" href="{re.escape(rel)}"\s*/?>',lambda _m,css=css:f'<style>\n{css}\n</style>',html)
    for p in [*SCREEN_FILES,PATCH_JS,APP_FILE]:
        rel=p.relative_to(PROTO).as_posix(); js=p.read_text(encoding='utf-8')
        html=re.sub(rf'<script src="{re.escape(rel)}"></script>',lambda _m,js=js:f'<script>\n{js}\n</script>',html)
    photo64=base64.b64encode(PHOTO.read_bytes()).decode('ascii')
    html=html.replace('assets/opc-reveal.jpg','data:image/jpeg;base64,'+photo64)
    leftover=re.findall(r'(?:href|src)="([^"#]+)"',html)
    local_left=[x for x in leftover if not x.startswith(('data:','http://','https://'))]
    if local_left: raise SystemExit(f'Uninlined local dependency detected: {local_left}')
    markers=['V0.4.1 readability and layout refinement patch','data:image/jpeg;base64,','按平台实时统计','AI 知识库建设项目']
    missing=[m for m in markers if m not in html]
    if missing: raise SystemExit(f'Standalone marker audit failed: {missing}')
    out=RELEASE/STANDALONE_NAME; out.write_text(html,encoding='utf-8'); return out

def render_contact_sheet(html):
    chrome=shutil.which('google-chrome') or shutil.which('google-chrome-stable') or shutil.which('chromium') or shutil.which('chromium-browser')
    if not chrome: raise SystemExit('Chrome/Chromium not found')
    from PIL import Image,ImageDraw
    temp=QA/'.v0.4.1-render'
    if temp.exists(): shutil.rmtree(temp)
    temp.mkdir(parents=True); uri=html.resolve().as_uri(); shots=[]
    for i in range(1,21):
        shot=temp/f'screen-{i:02d}.png'; cmd=[chrome,'--headless=new','--disable-gpu','--no-sandbox','--hide-scrollbars','--window-size=1920,1080','--force-device-scale-factor=1','--virtual-time-budget=1500',f'--screenshot={shot}',f'{uri}#{i:02d}']
        proc=subprocess.run(cmd,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True)
        if proc.returncode!=0 or not shot.exists(): raise SystemExit(f'Chrome render failed for screen {i:02d}: {proc.stderr[-1500:]}')
        shots.append(shot)
    cols,rows=5,4; tw,th,gap,lh=348,196,12,24; sw=cols*tw+(cols+1)*gap; sh=rows*(th+lh)+(rows+1)*gap
    sheet=Image.new('RGB',(sw,sh),'#e8ece8'); draw=ImageDraw.Draw(sheet)
    for idx,shot in enumerate(shots):
        row,col=divmod(idx,cols); x=gap+col*(tw+gap); y=gap+row*(th+lh+gap)
        im=Image.open(shot).convert('RGB').resize((tw,th),Image.Resampling.LANCZOS); sheet.paste(im,(x,y)); draw.text((x+5,y+th+4),f'SCREEN {idx+1:02d}',fill='#264d40')
    out=QA/'contact-sheet-v0.4.1.jpg'; sheet.save(out,'JPEG',quality=88,optimize=True); shutil.rmtree(temp); return out

def package(html,contact):
    readme=RELEASE/'README.md'; readme.write_text('# 数智健康 OPC 国际人才社区 Web Presentation V0.4.1\n\nV0.4.1 为基于 V0.4 的可读性与布局精修版本，原 V0.4 文件保持不覆盖。\n\n- Standalone HTML：20 屏单文件离线演示版，CSS、JS 与新版揭牌照片均内嵌。\n- 模块化源码：位于 `prototype/full-v0.4.1/`。\n- 主要调整：Screen 02 / 09 / 14 / 16，以及全局字号与总分结构收拢。\n- Contact Sheet：`qa/contact-sheet-v0.4.1.jpg`。\n',encoding='utf-8')
    inner=RELEASE/'HTML-SHA256.txt'; inner.write_text(f'{sha256(html)}  {STANDALONE_NAME}\n',encoding='utf-8')
    zp=RELEASE/ZIP_NAME
    with zipfile.ZipFile(zp,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z: z.write(html,STANDALONE_NAME); z.write(readme,'README.md'); z.write(inner,'HTML-SHA256.txt')
    lines=[f'{sha256(html)}  {STANDALONE_NAME}',f'{sha256(zp)}  {ZIP_NAME}',f'{sha256(contact)}  qa/{contact.name}']; (RELEASE/'SHA256SUMS.txt').write_text('\n'.join(lines)+'\n',encoding='utf-8')
    audit={'generated_at_utc':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'standalone':{'path':str(html.relative_to(ROOT)),'bytes':html.stat().st_size,'sha256':sha256(html)},'zip':{'path':str(zp.relative_to(ROOT)),'bytes':zp.stat().st_size,'sha256':sha256(zp)},'contact_sheet':{'path':str(contact.relative_to(ROOT)),'bytes':contact.stat().st_size,'sha256':sha256(contact)}}
    (QA/'release-build-audit-v0.4.1.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2)+'\n',encoding='utf-8'); return zp

def main():
    QA.mkdir(parents=True,exist_ok=True); require_files(); audit=audit_sources(); (QA/'source-reference-audit-v0.4.1.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2)+'\n',encoding='utf-8'); html=build_standalone(); contact=render_contact_sheet(html); zp=package(html,contact); print(json.dumps({'standalone':str(html.relative_to(ROOT)),'standalone_sha256':sha256(html),'zip':str(zp.relative_to(ROOT)),'zip_sha256':sha256(zp),'contact_sheet':str(contact.relative_to(ROOT))},ensure_ascii=False,indent=2))

if __name__=='__main__': main()
