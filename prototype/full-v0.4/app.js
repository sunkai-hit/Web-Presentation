const screenIds=Array.from({length:20},(_,i)=>String(i+1).padStart(2,'0'));
let current=0, wheelLock=false;
function showScreen(id,updateHash=true){
  const idx=screenIds.indexOf(id); if(idx<0)return;
  const old=current; current=idx;
  document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.dataset.screen===id));
  document.querySelectorAll('[data-go]').forEach(b=>b.classList.toggle('active',b.dataset.go===id));
  document.getElementById('stage').dataset.direction=idx>=old?'forward':'backward';
  if(updateHash) history.replaceState(null,'','#'+id);
  requestAnimationFrame(fitStage);
}
function fitStage(){
  const s=document.getElementById('stage'); const scale=Math.min(innerWidth/1920,innerHeight/1080);
  s.style.transform=`scale(${scale})`;
}
window.addEventListener('resize',fitStage);
window.addEventListener('load',()=>{const h=location.hash.replace('#',''); if(screenIds.includes(h))showScreen(h,false); fitStage()});
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>showScreen(b.dataset.go)));
window.addEventListener('keydown',e=>{
  if(['ArrowDown','PageDown',' '].includes(e.key)){e.preventDefault();showScreen(screenIds[Math.min(current+1,screenIds.length-1)])}
  if(['ArrowUp','PageUp'].includes(e.key)){e.preventDefault();showScreen(screenIds[Math.max(current-1,0)])}
  if(e.key==='Home'){e.preventDefault();showScreen('01')} if(e.key==='End'){e.preventDefault();showScreen('20')}
});
window.addEventListener('wheel',e=>{if(wheelLock)return; wheelLock=true; showScreen(screenIds[Math.max(0,Math.min(screenIds.length-1,current+(e.deltaY>0?1:-1)))]); setTimeout(()=>wheelLock=false,620)},{passive:true});

// Screen 02 roadmap focus
const roads=[...document.querySelectorAll('#s02 .roadmap-node')];
roads.forEach(r=>r.addEventListener('mouseenter',()=>{roads.forEach(x=>x.classList.remove('active'));r.classList.add('active')}));

// Screen 03 problem map
const probs=[...document.querySelectorAll('#s03 .problem')];
probs.forEach(p=>p.addEventListener('mouseenter',()=>{probs.forEach(x=>x.classList.remove('active'));p.classList.add('active')}));

// Screen 05 roles
const roleData={
  '人才':{title:'人才端',flow:['加入社区','学习实训','揭榜项目','完成交付','能力成长'],desc:'平台让人才从“报名成员”逐步成长为具备真实项目交付能力的 OPC。'},
  '企业':{title:'企业端',flow:['企业入驻','提出需求','标准项目','选择人才','验收成果'],desc:'企业不必直接面对复杂的人才筛选和项目管理，社区通过平台帮助其把问题转化为可交付项目。'},
  '导师':{title:'导师专家端',flow:['导师入库','课程授课','实训辅导','项目评审','人才评价'],desc:'导师专家贯穿培养和项目两条链路，为人才成长和项目质量提供专业支撑。'},
  '运营':{title:'社区运营端',flow:['人才招募','课程运营','需求梳理','项目撮合','成果孵化'],desc:'社区运营方通过统一后台管理人才、课程、企业、项目、合规与成果，形成持续运营机制。'}
};
const roleBtns=[...document.querySelectorAll('#s05 .role-node')];
roleBtns.forEach(btn=>btn.addEventListener('click',()=>{
  roleBtns.forEach(b=>b.classList.remove('active'));btn.classList.add('active');
  const d=roleData[btn.dataset.role];document.getElementById('roleTitle').textContent=d.title;
  document.getElementById('roleFlow').innerHTML=d.flow.map((x,i)=>`<span>${x}</span>${i<d.flow.length-1?'<i>→</i>':''}`).join('');
  document.getElementById('roleDesc').textContent=d.desc;document.getElementById('hubPath').textContent=d.flow.join(' → ');
}));

// Screen 07 loop
const loopData={
'人才招募':['人才/运营','注册、认证、入库、建档','基础人才档案'],
'课程学习':['人才/导师','课程学习、作业、考试','学习记录与成绩'],
'模拟实训':['人才/导师','实训任务、成果提交、导师反馈','实训评价与作品'],
'真实项目':['人才/企业/导师','把园区真实需求转为实训项目','真实业务场景证据'],
'揭榜接单':['人才/企业/运营','项目大厅、能力匹配、评审中榜','匹配与评审记录'],
'项目交付':['人才/企业/运营','计划、任务、里程碑、成果、验收','交付结果与企业评价'],
'评价认证':['运营/导师/企业','多源评价、OPC等级认定','人才能力画像'],
'OPC成长':['人才/社区','等级成长、成果展示、孵化服务','OPC成长与项目储备']};
const loopNodes=[...document.querySelectorAll('#s07 .loop-node')];
loopNodes.forEach(n=>n.addEventListener('mouseenter',()=>{loopNodes.forEach(x=>x.classList.remove('active'));n.classList.add('active');const d=loopData[n.dataset.loop];document.getElementById('loopDetail').innerHTML=`<strong>${n.dataset.loop} · ${d[0]}</strong><p>平台：${d[1]} ｜ 产生：${d[2]}</p>`}));

// Screen 08 Talent tabs and level switching (kept from key validation)
const tabBtns=[...document.querySelectorAll('#s08 [data-tab]')];
tabBtns.forEach(btn=>btn.addEventListener('click',()=>{tabBtns.forEach(b=>b.classList.remove('active'));btn.classList.add('active');document.querySelectorAll('#s08 [data-panel]').forEach(p=>p.classList.toggle('active',p.dataset.panel===btn.dataset.tab))}));
const levelBtns=[...document.querySelectorAll('#s08 [data-level]')];
levelBtns.forEach(btn=>btn.addEventListener('click',()=>{levelBtns.forEach(b=>b.classList.remove('active'));btn.classList.add('active');const badge=document.getElementById('opcBadge');badge.textContent=btn.dataset.level+' OPC';badge.style.background=btn.dataset.level==='高级'?'#f0e5ce':'#e0f2e9';badge.style.color=btn.dataset.level==='高级'?'#84642d':'#29634f'}));

// Screen 11 match animation
const matchBtn=document.getElementById('startMatch');
if(matchBtn) matchBtn.addEventListener('click',()=>{
  const engine=document.querySelector('#s11 .match-engine');engine.classList.remove('matching');void engine.offsetWidth;engine.classList.add('matching');
  document.getElementById('matchState').textContent='MATCHING';
  const candidates=[...document.querySelectorAll('#s11 .candidate')];candidates.forEach(c=>c.classList.remove('active'));
  setTimeout(()=>candidates[2]?.classList.add('active'),450);setTimeout(()=>{candidates.forEach(c=>c.classList.remove('active'));candidates[1]?.classList.add('active')},850);setTimeout(()=>{candidates.forEach(c=>c.classList.remove('active'));candidates[0]?.classList.add('active');document.getElementById('matchState').textContent='92% MATCH'},1350);
});

// Screen 12 Project stages (kept from key validation)
const stageData={
1:{k:'MILESTONE 01',t:'项目立项',d:'完成时间：9月20日（示意）',tasks:['确认项目目标','明确项目成员','确认交付边界'],deliver:'项目任务书 V1.0',status:'已确认',act:'项目动态：项目已完成立项，明确参与角色、周期和交付边界。'},
2:{k:'MILESTONE 02',t:'需求确认',d:'完成时间：9月25日（示意）',tasks:['企业需求访谈','业务范围确认','验收口径确认'],deliver:'需求确认单 V1.0',status:'已确认',act:'项目动态：企业需求已完成标准化，交付范围和验收口径已确认。'},
3:{k:'MILESTONE 03',t:'数据整理',d:'完成时间：10月05日（示意）',tasks:['资料收集','数据分类','敏感信息检查'],deliver:'资料清洗清单 V1.0',status:'已完成',act:'项目动态：资料已完成分类与清洗，进入知识库构建准备阶段。'},
4:{k:'MILESTONE 04',t:'知识库系统建设',d:'完成时间：10月18日（示意）',tasks:['知识文档清洗','RAG检索调优','问答效果测试'],deliver:'知识库 Beta V0.8',status:'等待企业确认',act:'项目动态：已完成核心资料入库，当前进入检索调优与问答效果测试阶段。'},
5:{k:'MILESTONE 05',t:'测试验收',d:'计划时间：10月25日（示意）',tasks:['业务场景测试','问题修正','验收材料准备'],deliver:'验收版本 V1.0',status:'待开始',act:'项目动态：将在系统建设确认后进入测试与企业验收。'},
6:{k:'MILESTONE 06',t:'项目归档',d:'计划时间：10月28日（示意）',tasks:['交付资料归档','企业评价','人才履历沉淀'],deliver:'项目归档包',status:'待开始',act:'项目动态：项目验收后将沉淀项目案例、企业评价和人才真实履历。'}
};
document.querySelectorAll('.stage-btn').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.stage-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const x=stageData[btn.dataset.stage];document.getElementById('stageKicker').textContent=x.k;document.getElementById('stageTitle').textContent=x.t;document.getElementById('stageDue').textContent=x.d;document.getElementById('task1').textContent=x.tasks[0];document.getElementById('task2').textContent=x.tasks[1];document.getElementById('task3').textContent=x.tasks[2];document.getElementById('deliverName').textContent=x.deliver;document.getElementById('deliverStatus').textContent=x.status;document.getElementById('activityText').textContent=x.act;}));

// Screen 13 certification levels
const certData={初级:['初级 OPC','课程 + 模拟实训'],中级:['中级 OPC','至少 1 个真实项目'],高级:['高级 OPC','多个项目 + 商业化能力']};
const certCards=[...document.querySelectorAll('#s13 .level-card')];
certCards.forEach(c=>c.addEventListener('click',()=>{certCards.forEach(x=>x.classList.remove('active'));c.classList.add('active');const d=certData[c.dataset.cert];document.getElementById('certLevel').textContent=d[0];document.getElementById('certScore').textContent=d[1]}));

// Screen 16 ops tabs
const opsData={人才:['人才运营',[88,74,58,36,24]],培训:['培训运营',[92,79,62,46,32]],企业:['企业运营',[72,60,49,38,22]],项目:['项目运营',[80,68,57,40,31]],成果:['成果运营',[62,53,42,33,28]]};
const opsBtns=[...document.querySelectorAll('#s16 [data-ops]')];
opsBtns.forEach(b=>b.addEventListener('click',()=>{opsBtns.forEach(x=>x.classList.remove('active'));b.classList.add('active');const d=opsData[b.dataset.ops];document.getElementById('opsChartTitle').textContent=d[0];document.querySelectorAll('#s16 .bar-chart i').forEach((el,i)=>el.style.setProperty('--h',d[1][i]+'%'))}));
