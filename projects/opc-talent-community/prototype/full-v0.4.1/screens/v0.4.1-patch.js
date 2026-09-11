// V0.4.1 incremental DOM patch
(() => {
  // Screen 02 photo compatibility: prefer PNG generated from the same unveiling photo.
  // Standalone builds inline this path as a data:image/png;base64 URI.
  const revealPhoto=document.querySelector('#s02 .reveal-photo img');
  if(revealPhoto){
    revealPhoto.src='assets/opc-reveal.png';
    revealPhoto.onerror=()=>{
      if(revealPhoto.dataset.fallback==='1') return;
      revealPhoto.dataset.fallback='1';
      revealPhoto.src='assets/opc-reveal.jpg';
    };
  }

  const s16=document.getElementById('s16');
  if(!s16) return;
  const metrics=s16.querySelectorAll('.ops-metrics .om');
  if(metrics[2]) metrics[2].innerHTML='<small>企业需求</small><b>动态</b><span>按平台实时统计</span>';
  if(metrics[3]) metrics[3].innerHTML='<small>孵化项目</small><b>累计</b><span>随项目持续沉淀</span>';
  const cols=s16.querySelectorAll('.kanban-cols > div');
  const data=[
    ['待梳理','企业需求',['中医药知识库需求','科普数字产品需求']],
    ['揭榜中','项目匹配',['AI 知识库建设项目','轻量管理系统项目']],
    ['执行中','真实项目',['资料整理与知识建库','AI 问答效果调优','阶段成果确认']],
    ['待验收','阶段成果',['项目交付包','企业验收与评价']]
  ];
  cols.forEach((col,i)=>{const d=data[i];if(!d)return;col.innerHTML=`<small>${d[0]}</small><b>${d[1]}</b>${d[2].map(x=>`<span>${x}</span>`).join('')}`;});
})();