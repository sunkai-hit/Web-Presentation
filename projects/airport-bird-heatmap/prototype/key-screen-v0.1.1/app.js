(function(){
  const frames=[
    {t:360,total:620,high:42,events:18,hot:[['west',.16,.33,.58,.95],['east',.76,.20,.40,.78],['north',.56,.17,.28,.55],['south',.60,.75,.20,.38],['grass',.84,.58,.18,.35]]},
    {t:480,total:910,high:118,events:37,hot:[['west',.18,.31,.72,1],['east',.78,.22,.55,.92],['north',.58,.18,.40,.68],['southwest',.37,.78,.22,.38],['grass',.82,.57,.28,.52]]},
    {t:600,total:1280,high:224,events:68,hot:[['west',.22,.35,.78,1],['east',.74,.27,.72,1],['north',.62,.25,.46,.74],['south',.59,.74,.55,.82],['grass',.79,.60,.34,.58]]},
    {t:720,total:1510,high:286,events:94,hot:[['west',.27,.39,.55,.85],['east',.70,.33,.84,1],['north',.65,.31,.54,.86],['south',.63,.69,.72,1],['grass',.76,.55,.46,.74]]},
    {t:900,total:1740,high:338,events:126,hot:[['west',.31,.43,.35,.62],['east',.67,.40,.66,.96],['north',.70,.35,.78,1],['south',.67,.62,.86,1],['grass',.77,.51,.62,.9]]},
    {t:1080,total:1190,high:176,events:147,hot:[['west',.22,.38,.28,.48],['east',.73,.31,.46,.76],['north',.62,.24,.38,.66],['south',.61,.71,.58,.85],['grass',.82,.56,.42,.68]]},
    {t:1200,total:760,high:84,events:155,hot:[['west',.16,.30,.32,.55],['east',.79,.20,.40,.68],['north',.55,.17,.26,.44],['south',.56,.77,.31,.52],['grass',.85,.58,.30,.50]]}
  ];
  const zones={
    west:{name:'西侧水系区域',desc:'水体与滩涂吸引鸥类、鹭类停留，清晨活动最集中。'},
    north:{name:'北侧草丛区域',desc:'草丛与空旷地带存在觅食活动，上午后活动向跑道北侧迁移。'},
    east:{name:'东北林地区域',desc:'林地鸟群在上午至中午活跃，受风向影响可能向飞行区移动。'},
    south:{name:'东南林地区域',desc:'午后活动增强，鸟群存在穿越跑道南侧航迹的风险。'},
    grass:{name:'草丛区域',desc:'开阔草地在中午至傍晚形成明显聚集，需联动驱鸟设备。'},
    southwest:{name:'南侧草丛区域',desc:'活动强度中等，作为迁飞路径中的短暂停留区域。'}
  };

  const timeline=document.getElementById('timeline');
  const canvas=document.getElementById('heatCanvas');
  const map=document.getElementById('mapArea');
  const ctx=canvas.getContext('2d');
  const markersEl=document.getElementById('markers');
  const warnEl=document.getElementById('warningList');
  const filters=document.querySelector('.filters');

  const trackCanvas=document.createElement('canvas');
  trackCanvas.id='trackCanvas';
  trackCanvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;z-index:8;pointer-events:none;mix-blend-mode:screen;';
  map.insertBefore(trackCanvas,markersEl);
  const trackCtx=trackCanvas.getContext('2d');

  const style=document.createElement('style');
  style.textContent='.trajectoryToggle{height:35px;padding:0 12px;border:1px solid #347fc7;background:#103767;color:#dff5ff;border-radius:5px;cursor:pointer;font-weight:700;white-space:nowrap}.trajectoryToggle.active{background:linear-gradient(180deg,#1288e9,#0d5cae);border-color:#61cfff;box-shadow:0 0 12px #1ebcff66}.trackLegend{display:inline-block;width:22px;height:2px;background:linear-gradient(90deg,#23e7ff,#fff);box-shadow:0 0 6px #26dfff;position:relative}.trackLegend:after{content:"";position:absolute;right:-1px;top:-3px;border:4px solid transparent;border-left-color:#fff}';
  document.head.appendChild(style);

  const trackToggle=document.createElement('button');
  trackToggle.type='button';
  trackToggle.className='trajectoryToggle active';
  trackToggle.id='trackToggle';
  trackToggle.textContent='✓ 鸟群移动轨迹';
  filters.appendChild(trackToggle);

  const legend=document.querySelector('.legend');
  if(legend){
    const row=document.createElement('div');
    row.className='row';
    row.innerHTML='<span class="trackLegend"></span>移动轨迹';
    legend.insertBefore(row,legend.children[2]||null);
  }

  let playing=true,speed=1,demo=true,timer=null,activeZone=null,showTracks=true;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const pad=n=>String(n).padStart(2,'0');
  const riskClass=val=>val>.72?'high':val>.46?'mid':'low';
  const trackColor=cls=>cls==='high'?'255,87,105':cls==='mid'?'255,190,64':'55,220,255';

  function fmt(mins){return `${pad(Math.floor(mins/60))}:${pad(Math.round(mins%60))}`}

  function frameAt(t){
    let a=frames[0],b=frames[frames.length-1];
    for(let i=0;i<frames.length-1;i++){
      if(t>=frames[i].t&&t<=frames[i+1].t){a=frames[i];b=frames[i+1];break}
    }
    return {a,b,p:(t-a.t)/(b.t-a.t||1)};
  }

  function stateForZone(frame,zone){return frame.hot.find(v=>v[0]===zone)||null}

  function zoneStateAt(zone,t){
    const {a,b,p}=frameAt(t);
    const x=stateForZone(a,zone),y=stateForZone(b,zone);
    if(!x&&!y)return null;
    const from=x||y,to=y||x;
    return [zone,from[1]+(to[1]-from[1])*p,from[2]+(to[2]-from[2])*p,from[3]+(to[3]-from[3])*p,from[4]+(to[4]-from[4])*p];
  }

  function interpolateHot(a,b,p){
    const keys=new Set([...a.hot.map(x=>x[0]),...b.hot.map(x=>x[0])]);
    return [...keys].map(k=>{
      const x=a.hot.find(v=>v[0]===k)||b.hot.find(v=>v[0]===k);
      const y=b.hot.find(v=>v[0]===k)||a.hot.find(v=>v[0]===k);
      return [k,x[1]+(y[1]-x[1])*p,x[2]+(y[2]-x[2])*p,x[3]+(y[3]-x[3])*p,x[4]+(y[4]-x[4])*p];
    });
  }

  function resizeCanvas(target,context,r,dpr){
    target.width=Math.max(1,Math.round(r.width*dpr));
    target.height=Math.max(1,Math.round(r.height*dpr));
    target.style.width=r.width+'px';
    target.style.height=r.height+'px';
    context.setTransform(dpr,0,0,dpr,0,0);
  }

  function resize(){
    const r=map.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);
    resizeCanvas(canvas,ctx,r,dpr);
    resizeCanvas(trackCanvas,trackCtx,r,dpr);
    draw();
  }

  function blob(x,y,r,intensity){
    const g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,`rgba(255,45,45,${.88*intensity})`);
    g.addColorStop(.22,`rgba(255,133,0,${.92*intensity})`);
    g.addColorStop(.45,`rgba(255,240,30,${.72*intensity})`);
    g.addColorStop(.68,`rgba(0,240,140,${.48*intensity})`);
    g.addColorStop(.86,`rgba(0,140,255,${.24*intensity})`);
    g.addColorStop(1,'rgba(0,80,255,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
  }

  function drawArrow(context,x1,y1,x2,y2,color,size=8){
    const angle=Math.atan2(y2-y1,x2-x1);
    context.save();
    context.translate(x2,y2);context.rotate(angle);
    context.fillStyle=color;context.shadowColor=color;context.shadowBlur=8;
    context.beginPath();context.moveTo(0,0);context.lineTo(-size,-size*.55);context.lineTo(-size,size*.55);context.closePath();context.fill();
    context.restore();
  }

  function drawTracks(t,hot){
    const w=map.clientWidth,h=map.clientHeight;
    trackCtx.clearRect(0,0,w,h);
    if(!showTracks)return;

    const region=document.getElementById('regionSelect').value;
    const riskFilter=document.getElementById('riskSelect').value;
    const start=Math.max(360,t-240);

    hot.forEach(current=>{
      const zone=current[0],cls=riskClass(current[3]);
      if(region!=='all'&&region!==zone)return;
      if(riskFilter!=='all'&&riskFilter!==cls)return;

      const pts=[];
      for(let tm=start;tm<=t;tm+=15){
        const s=zoneStateAt(zone,tm);
        if(s)pts.push([s[1]*w,s[2]*h,tm]);
      }
      const end=zoneStateAt(zone,t);
      if(end)pts.push([end[1]*w,end[2]*h,t]);
      if(pts.length<2)return;

      const rgb=trackColor(cls);
      trackCtx.save();
      trackCtx.lineCap='round';trackCtx.lineJoin='round';
      trackCtx.beginPath();trackCtx.moveTo(pts[0][0],pts[0][1]);
      for(let i=1;i<pts.length;i++)trackCtx.lineTo(pts[i][0],pts[i][1]);
      trackCtx.strokeStyle=`rgba(${rgb},.17)`;trackCtx.lineWidth=8;trackCtx.shadowColor=`rgba(${rgb},.6)`;trackCtx.shadowBlur=16;trackCtx.stroke();

      trackCtx.beginPath();trackCtx.moveTo(pts[0][0],pts[0][1]);
      for(let i=1;i<pts.length;i++)trackCtx.lineTo(pts[i][0],pts[i][1]);
      trackCtx.strokeStyle=`rgba(${rgb},.9)`;trackCtx.lineWidth=2.2;trackCtx.setLineDash([9,7]);trackCtx.shadowBlur=7;trackCtx.stroke();
      trackCtx.setLineDash([]);

      const markerSteps=[Math.floor(pts.length*.45),Math.floor(pts.length*.7),pts.length-1];
      markerSteps.forEach(idx=>{if(idx>0&&pts[idx])drawArrow(trackCtx,pts[idx-1][0],pts[idx-1][1],pts[idx][0],pts[idx][1],`rgba(${rgb},.95)`,idx===pts.length-1?10:7)});

      const last=pts[pts.length-1],prev=pts[Math.max(0,pts.length-2)];
      const ang=Math.atan2(last[1]-prev[1],last[0]-prev[0]);
      for(let i=0;i<3;i++){
        const offset=10+i*8;
        const bx=last[0]-Math.cos(ang)*offset+Math.sin(ang)*(i-1)*4;
        const by=last[1]-Math.sin(ang)*offset-Math.cos(ang)*(i-1)*4;
        trackCtx.fillStyle=`rgba(${rgb},${.95-i*.2})`;trackCtx.shadowColor=`rgba(${rgb},.9)`;trackCtx.shadowBlur=9;
        trackCtx.beginPath();trackCtx.arc(bx,by,2.3-i*.25,0,Math.PI*2);trackCtx.fill();
      }
      trackCtx.restore();
    });
  }

  function draw(){
    const t=+timeline.value,{a,b,p}=frameAt(t),hot=interpolateHot(a,b,p),w=map.clientWidth,h=map.clientHeight;
    ctx.clearRect(0,0,w,h);ctx.globalCompositeOperation='lighter';
    const region=document.getElementById('regionSelect').value;
    hot.forEach((v,i)=>{
      if(region!=='all'&&region!==v[0])return;
      const rad=(58+58*v[3])*(w/1600+.25);
      blob(v[1]*w,v[2]*h,rad,v[4]);
      if(v[3]>.55)blob((v[1]+.018*Math.sin(t/41+i))*w,(v[2]+.015*Math.cos(t/53+i))*h,rad*.62,clamp(v[4]*.8,0,1));
    });
    ctx.globalCompositeOperation='source-over';
    drawTracks(t,hot);
    updateUI(t,a,b,p,hot);
  }

  function updateUI(t,a,b,p,hot){
    document.getElementById('totalCount').textContent=Math.round(a.total+(b.total-a.total)*p);
    document.getElementById('highCount').textContent=Math.round(a.high+(b.high-a.high)*p);
    document.getElementById('eventCount').textContent=Math.round(a.events+(b.events-a.events)*p);
    const time=fmt(t);
    document.getElementById('timeText').textContent='2025-06-06 '+time;
    document.getElementById('headerDate').textContent='2025/06/06 '+time;
    const label=document.getElementById('progressLabel'),percent=(t-360)/840;
    label.textContent=time;label.style.left=(8+percent*(document.querySelector('.trackWrap').clientWidth-16))+'px';
    renderMarkers(hot);renderWarnings(t,hot);renderZoneInfo(t,hot);
  }

  function renderMarkers(hot){
    markersEl.innerHTML='';
    const riskFilter=document.getElementById('riskSelect').value;
    hot.forEach(v=>{
      const cls=riskClass(v[3]);
      if(riskFilter!=='all'&&riskFilter!==cls)return;
      const el=document.createElement('div');
      el.className='marker '+cls+(v[3]>.75?' pulse':'');
      el.textContent=cls==='high'?'↗':cls==='mid'?'●':'✓';
      el.style.left=v[1]*100+'%';el.style.top=v[2]*100+'%';el.title=zones[v[0]].name;markersEl.appendChild(el);
    });
    [[.42,.38,'01'],[.55,.48,'02'],[.66,.41,'03'],[.31,.58,'04']].forEach(d=>{
      const el=document.createElement('div');el.className='marker device';el.textContent='⌁';el.style.left=d[0]*100+'%';el.style.top=d[1]*100+'%';el.title='雷达站'+d[2];markersEl.appendChild(el);
    });
  }

  function renderWarnings(t,hot){
    warnEl.innerHTML=hot.slice().sort((x,y)=>y[3]-x[3]).slice(0,5).map((v,i)=>{
      const cls=riskClass(v[3]),label=cls==='high'?'高风险':cls==='mid'?'中风险':'低风险',dt=fmt(clamp(t-i*13,360,1200)),action=cls==='high'?'已联动驱鸟':cls==='mid'?'待确认':'监测中';
      return `<div class="warning ${cls}"><span class="dot ${cls}"></span><div><strong>${label}　${zones[v[0]].name}</strong><small>${dt}　鸟群活动密度 ${Math.round(v[3]*100)}% · ${action}</small></div><span class="pill">${cls==='high'?'处置':cls==='mid'?'研判':'关注'}</span></div>`;
    }).join('');
  }

  function renderZoneInfo(t,hot){
    const box=document.getElementById('zoneInfo');
    if(!activeZone){box.classList.remove('show');return}
    const v=hot.find(x=>x[0]===activeZone);
    if(!v){box.classList.remove('show');return}
    box.classList.add('show');
    box.innerHTML=`<h3>${zones[activeZone].name}</h3><p>${zones[activeZone].desc}</p><p>当前活动密度：<b>${Math.round(v[3]*100)}%</b>　风险：<b>${riskClass(v[3])==='high'?'高':riskClass(v[3])==='mid'?'中':'低'}</b></p><p>近4小时移动轨迹：<b>${showTracks?'已显示':'已隐藏'}</b></p><p>回放时刻：<b>${fmt(t)}</b></p>`;
  }

  function setPlay(v){
    playing=v;document.getElementById('playBtn').textContent=playing?'Ⅱ':'▶';
    if(timer)clearInterval(timer);
    timer=setInterval(()=>{
      if(!playing)return;
      let n=+timeline.value+5*speed;
      if(n>1200)n=demo?360:1200;
      timeline.value=n;draw();
    },600);
  }

  trackToggle.addEventListener('click',()=>{
    showTracks=!showTracks;
    trackToggle.classList.toggle('active',showTracks);
    trackToggle.textContent=(showTracks?'✓ ':'')+'鸟群移动轨迹';
    draw();
  });
  timeline.addEventListener('input',()=>{draw();if(playing&&!demo)setPlay(false)});
  document.getElementById('playBtn').onclick=()=>setPlay(!playing);
  document.getElementById('speedBtn').onclick=e=>{speed=speed===1?2:speed===2?4:1;e.target.textContent=speed+'×'};
  document.getElementById('modeBtn').onclick=e=>{demo=!demo;e.target.classList.toggle('active',demo);e.target.textContent=demo?'演示':'单次'};
  document.getElementById('regionSelect').addEventListener('change',draw);
  document.getElementById('riskSelect').addEventListener('change',draw);
  document.querySelectorAll('[data-zone]').forEach(el=>el.addEventListener('click',()=>{
    activeZone=el.dataset.zone;
    document.querySelectorAll('.zone').forEach(z=>z.classList.toggle('active',z.dataset.zone===activeZone));
    draw();
  }));
  window.addEventListener('resize',resize);
  resize();setPlay(true);
})();
