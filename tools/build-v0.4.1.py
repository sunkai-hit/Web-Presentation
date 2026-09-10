from pathlib import Path
import base64, re, shutil, hashlib

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'prototype' / 'full-v0.4'
DST = ROOT / 'prototype' / 'full-v0.4.1'
REL = ROOT / 'release' / 'v0.4.1'
QA = ROOT / 'qa'

if DST.exists():
    shutil.rmtree(DST)
if REL.exists():
    shutil.rmtree(REL)
shutil.copytree(SRC, DST)
REL.mkdir(parents=True, exist_ok=True)

# Replace Screen 02 reveal photo with the supplied attachment snapshot.
b64 = (ROOT / 'tools' / 'v0.4.1-opc-reveal.base64.txt').read_text(encoding='utf-8').strip()
(DST / 'assets' / 'opc-reveal.jpg').write_bytes(base64.b64decode(b64))

OVERRIDE = r'''/* ===== V0.4.1 readability & layout refinement ===== */
/* Global readability: keep page titles unchanged, enlarge supporting copy */
.eyebrow{font-size:17px!important}.page-index{font-size:14px!important}.small-note{font-size:15px!important}.brandmark{font-size:13px!important}.keyhint{font-size:12px!important}
.screen small{font-size:13px!important;line-height:1.45}.screen button,.screen span,.screen b,.screen strong{letter-spacing:normal}
.subtitle{font-size:22px!important}.goal p,.road-copy p,.problem p,.role-detail p,.loop-detail p,.family p,.mentor-note p,.standard-card p,.candidate-note,.level-card p,.compliance-flow p,.data-island p,.scope-center p,.scope-standard p,.phase p,.value p{font-size:15px!important;line-height:1.62!important}
.center-box p,.center-box .detail,.cap-row p,.person-info p,.lesson-step b,.std-grid p,.candidate b,.candidate span,.panel-head b,.todo li,.ops-feed>span{font-size:14px!important}
.metric span,.skill .label,.nav-item,.tabs button,.level-switch button,.match-tags span,.review-flow span,.review-flow b,.resource,.scope-item,.next-cloud span{font-size:13px!important}

/* Screen 01: pull satellites closer to the core and enlarge them */
.hero-label{font-size:16px!important;padding:12px 16px!important;min-width:168px;text-align:center}.hl1{left:72px!important;top:148px!important}.hl2{right:52px!important;top:236px!important}.hl3{left:68px!important;bottom:192px!important}.hl4{right:58px!important;bottom:142px!important}

/* Screen 02: supplied photo + larger, denser right-side milestone cards */
.stage-story-grid{grid-template-columns:5.1fr 6.9fr!important;gap:34px!important}.reveal-photo{height:405px!important}.reveal-photo img{object-position:center center!important;filter:none!important}.roadmap-rail{padding:22px 0 18px 24px!important;justify-content:flex-start!important;gap:16px!important}.road-line{left:74px!important;top:74px!important;bottom:74px!important}.roadmap-node{grid-template-columns:96px 1fr 196px!important;gap:22px!important;padding:24px 24px 24px 0!important;min-height:222px!important}.road-no{width:92px!important;height:92px!important;font-size:34px!important}.road-copy h3{font-size:26px!important;margin:7px 0 10px!important}.road-copy p{font-size:16px!important}.road-visual{height:112px!important}.road-visual span{font-size:13px!important;padding:8px 11px!important}.transition-note{font-size:15px!important}

/* Screen 03: larger problem cards, closer to the platform core */
.platform-core{width:350px!important;height:350px!important}.platform-core strong{font-size:30px!important}.platform-core p{font-size:16px!important;width:250px!important}.problem{width:398px!important;min-height:150px!important;padding:23px 22px 20px 82px!important}.p-ico{width:48px!important;height:48px!important;font-size:17px!important}.problem h3{font-size:21px!important}.problem>span{font-size:13px!important}.p1{left:86px!important;top:86px!important}.p2{right:86px!important;top:82px!important}.p3{left:64px!important;bottom:108px!important}.p4{right:64px!important;bottom:108px!important}.p5{width:430px!important;bottom:10px!important}

/* Screen 05: make role satellites larger and closer to the center */
.role-node{width:310px!important;min-height:118px!important;padding:21px 22px 20px 82px!important}.role-node strong{font-size:22px!important}.role-node small{font-size:14px!important}.rn1{left:86px!important;top:90px!important}.rn2{right:72px!important;top:90px!important}.rn3{left:72px!important;bottom:92px!important}.rn4{right:72px!important;bottom:92px!important}.avatar-illustration{width:50px!important;height:50px!important}.hub-core{width:335px!important;height:335px!important}.hub-core strong{font-size:30px!important}.hub-path{font-size:14px!important}

/* Screen 09: 4 equal top cards, full-width middle strip, 2 aligned lower panels */
.learning-layout{height:790px!important;grid-template-columns:repeat(12,1fr)!important;grid-template-rows:220px 86px 1fr!important;gap:18px!important;margin-top:28px!important}.course-families{grid-column:1/13!important;grid-row:1!important;grid-template-columns:repeat(4,1fr)!important;gap:16px!important}.family{padding:22px 24px!important}.family h3{font-size:22px!important}.family p{max-width:255px!important;font-size:15px!important}.learning-path{grid-column:1/13!important;grid-row:2!important;width:100%!important}.learning-path span{font-size:14px!important;padding:9px 15px!important}.course-ui{grid-column:1/7!important;grid-row:3!important;width:100%!important;padding:22px 24px!important}.learning-illustration{grid-column:7/13!important;grid-row:3!important;width:100%!important}.course-hero h2{font-size:27px!important}.lesson-step{padding:11px 0!important}.lesson-step b{font-size:15px!important}.mentor-note{margin-top:12px!important;padding:12px 14px!important}

/* Screen 11: enlarge both side panels and reduce the distance to the matching engine */
.match-layout{grid-template-columns:3.6fr 4.8fr 3.6fr!important;gap:18px!important}.match-project,.candidate-list{height:600px!important;padding:30px!important}.match-project h2{font-size:32px!important}.criterion{font-size:13px!important;padding:10px 14px!important}.candidate{padding:16px!important}.candidate b{font-size:16px!important}.candidate span{font-size:13px!important}.candidate strong{font-size:23px!important}.engine-core{width:190px!important;height:190px!important}

/* Screen 13: tighter, larger certification constellation */
.cert-layout{grid-template-columns:4.2fr 3.3fr 4.5fr!important;gap:20px!important}.ability-orbit{width:500px!important;height:500px!important}.ability-center{width:195px!important;height:195px!important}.ability-chip{font-size:14px!important;padding:12px 16px!important}.ac1{top:7%!important}.ac2{right:7%!important}.ac3{bottom:7%!important}.ac4{left:7%!important}.level-card{padding:23px 24px!important}.level-card strong{font-size:23px!important}.source b{font-size:18px!important}.source>span{width:60px!important;height:60px!important}

/* Screen 14: move the complete composition down and improve legibility */
.compliance-layout{margin-top:76px!important;height:710px!important}.shield-core{top:116px!important}.compliance-flow article{height:275px!important;padding:26px 24px!important}.compliance-flow h3{font-size:24px!important}.compliance-flow p{font-size:15px!important}.risk-scale{margin-top:36px!important}.risk{height:124px!important}.risk b{font-size:18px!important}.risk span{font-size:14px!important}.compliance-note{bottom:4px!important;font-size:13px!important}

/* Screen 15: bring resource satellites inward and enlarge them */
.resource-wheel{width:550px!important;height:550px!important}.resource-center{width:185px!important;height:185px!important}.resource{width:132px!important;height:72px!important;font-size:14px!important}.r1{left:209px!important;top:20px!important}.r2{right:42px!important;top:86px!important}.r3{right:10px!important;top:238px!important}.r4{right:45px!important;bottom:78px!important}.r5{left:208px!important;bottom:14px!important}.r6{left:42px!important;bottom:80px!important}.r7{left:10px!important;top:238px!important}.r8{left:44px!important;top:86px!important}

/* Screen 16: complete project-operation content and improve metric clarity */
.ops-console{height:820px!important;padding:24px!important;grid-template-rows:58px 136px 1fr 58px!important}.ops-tabs button{font-size:14px!important;padding:10px 17px!important}.ops-date{font-size:13px!important}.om{padding:20px 22px!important}.om small{font-size:13px!important}.om b{font-size:38px!important}.om b.word-metric{font-size:25px!important;margin-top:14px!important}.om span{font-size:13px!important}.panel-head b{font-size:16px!important}.panel-head span{font-size:12px!important}.kanban-cols{gap:10px!important}.kanban-cols>div{padding:14px!important}.kanban-cols small{font-size:12px!important}.kanban-cols b{font-size:14px!important}.kanban-cols span{height:auto!important;min-height:58px!important;padding:10px!important;font-size:12px!important;line-height:1.45!important;color:#52635c!important}.todo li{font-size:13px!important}.todo li em{font-size:11px!important}.ops-feed>span{font-size:12px!important}.ops-feed small{font-size:11px!important}

/* Screen 17: larger data islands, closer to the data core */
.data-core{width:360px!important;height:360px!important}.data-core strong{font-size:31px!important}.data-core p{font-size:14px!important;width:270px!important}.data-island{width:390px!important;height:220px!important;padding:22px 22px 20px 78px!important}.data-island h3{font-size:20px!important}.data-island strong{font-size:14px!important}.data-island p{font-size:14px!important}.di1{left:118px!important;top:28px!important}.di2{right:118px!important;top:28px!important}.di3{left:104px!important;bottom:30px!important}.di4{right:104px!important;bottom:30px!important}

/* Screen 18: move scope satellites inward and enlarge them */
.scope-center{width:330px!important;height:330px!important}.scope-center strong{font-size:30px!important}.scope-center p{font-size:15px!important;width:250px!important}.scope-item{width:142px!important;height:70px!important;font-size:14px!important}.si1{top:54px!important}.si2{right:158px!important;top:116px!important}.si3{right:76px!important;top:246px!important}.si4{right:62px!important;top:390px!important}.si5{right:156px!important;bottom:116px!important}.si6{bottom:58px!important}.si7{left:156px!important;bottom:116px!important}.si8{left:62px!important;top:390px!important}.si9{left:76px!important;top:246px!important}.si10{left:158px!important;top:116px!important}

/* Screen 20: larger value satellites, pulled toward the center */
.value-core{width:340px!important;height:340px!important}.value-core strong{font-size:28px!important}.value-core b{font-size:18px!important}.value{width:340px!important;height:165px!important;padding:22px 24px!important}.value h3{font-size:25px!important}.value p{font-size:14px!important}.v1{left:138px!important;top:30px!important}.v2{right:138px!important;top:26px!important}.v3{left:94px!important;bottom:94px!important}.v4{right:94px!important;bottom:92px!important}.v5{width:360px!important;bottom:10px!important}.final-slogan{font-size:21px!important}
'''
(DST / 'css' / 'v0.4.1-overrides.css').write_text(OVERRIDE, encoding='utf-8')

PATCH = r'''// V0.4.1 content completion and visual patch
(() => {
  const s16 = document.getElementById('s16');
  if (s16) {
    const ms = s16.querySelectorAll('.ops-metrics .om');
    if (ms[2]) { ms[2].querySelector('small').textContent='企业需求池'; ms[2].querySelector('b').textContent='动态统计'; ms[2].querySelector('b').classList.add('word-metric'); ms[2].querySelector('span').textContent='按运营数据实时汇总'; }
    if (ms[3]) { ms[3].querySelector('small').textContent='孵化项目库'; ms[3].querySelector('b').textContent='持续储备'; ms[3].querySelector('b').classList.add('word-metric'); ms[3].querySelector('span').textContent='优秀成果持续进入'; }
    const cols = s16.querySelectorAll('.kanban-cols > div');
    const cards = [
      ['企业知识库需求（示意）','科普数字产品需求（示意）'],
      ['AI 内容助手项目（示意）'],
      ['知识库 Beta 项目（示意）','真实项目实训 A（示意）','资料数字化任务（示意）'],
      ['阶段成果包（示意）']
    ];
    cols.forEach((col, i) => { const slots = col.querySelectorAll('span'); slots.forEach((slot,j)=>slot.textContent=(cards[i]&&cards[i][j])||''); });
  }
  document.querySelectorAll('.brandmark').forEach(x=>x.textContent=x.textContent.replace('V0.4','V0.4.1'));
})();
'''
(DST / 'patch-v0.4.1.js').write_text(PATCH, encoding='utf-8')

index = (DST / 'index.html').read_text(encoding='utf-8')
index = index.replace('Web Presentation V0.4</title>', 'Web Presentation V0.4.1</title>')
index = index.replace('<link rel="stylesheet" href="css/part-4.css"/>', '<link rel="stylesheet" href="css/part-4.css"/><link rel="stylesheet" href="css/v0.4.1-overrides.css"/>')
index = index.replace('<script src="app.js"></script>', '<script src="app.js"></script><script src="patch-v0.4.1.js"></script>')
(DST / 'index.html').write_text(index, encoding='utf-8')

# Build a standalone HTML from the updated multi-file version.
standalone = index
css_files = ['part-1.css','part-2.css','part-3.css','part-4.css','v0.4.1-overrides.css']
css = '\n'.join((DST/'css'/f).read_text(encoding='utf-8') for f in css_files)
standalone = re.sub(r'<link rel="stylesheet" href="css/part-1\.css"/><link rel="stylesheet" href="css/part-2\.css"/><link rel="stylesheet" href="css/part-3\.css"/><link rel="stylesheet" href="css/part-4\.css"/><link rel="stylesheet" href="css/v0\.4\.1-overrides\.css"/>', '<style>\n'+css+'\n</style>', standalone)
for f in ['screens-01-05.js','screens-06-10.js','screens-11-15.js','screens-16-20.js']:
    tag = f'<script src="screens/{f}"></script>'
    standalone = standalone.replace(tag, '<script>\n'+(DST/'screens'/f).read_text(encoding='utf-8')+'\n</script>')
standalone = standalone.replace('<script src="app.js"></script>', '<script>\n'+(DST/'app.js').read_text(encoding='utf-8')+'\n</script>')
standalone = standalone.replace('<script src="patch-v0.4.1.js"></script>', '<script>\n'+PATCH+'\n</script>')
standalone = standalone.replace('src="assets/opc-reveal.jpg"', 'src="data:image/jpeg;base64,'+b64+'"')
standalone_path = REL / '数智健康OPC国际人才社区_Web_Presentation_V0.4.1_Standalone.html'
standalone_path.write_text(standalone, encoding='utf-8')

# Release notes and reproducibility manifest.
sha = hashlib.sha256(standalone_path.read_bytes()).hexdigest()
(REL/'README.md').write_text(f'''# Web Presentation V0.4.1\n\n本版本基于 V0.4，不覆盖 V0.4。\n\n本轮调整：\n- Screen 02 替换为用户提供的正式揭牌现场照片，并放大右侧三阶段卡片；\n- Screen 09 重构四课程卡 / 中间成长链 / 下方双面板布局；\n- Screen 14 整体下移并改善文字可读性；\n- Screen 16 补全项目运营卡片，并修正顶部后两项指标的表达；\n- 全局放大非主标题文字；\n- Screen 01/03/05/11/13/15/17/18/20 收紧总分结构距离并放大分部件。\n\nStandalone SHA256: `{sha}`\n''', encoding='utf-8')
(QA/'v0.4.1-change-log.md').write_text('''# V0.4.1 页面调整记录\n\n- [x] 第二页图片替换\n- [x] 第二页右侧三阶段卡片增大并压缩间距\n- [x] 第九页上方四卡横向重排\n- [x] 第九页中间流程条与下方双面板等宽\n- [x] 第十四页整体下移\n- [x] 第十六页补全项目运营内容并修正顶部后两项\n- [x] 全局辅助字号放大\n- [x] 01/03/05/11/13/15/17/18/20 总分结构收紧、分部件放大\n- [x] 多文件版与单文件版同步生成\n''', encoding='utf-8')
print('built', DST, standalone_path, sha)
