(function(){
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  function clock(){var d=new Date(),w=['周日','周一','周二','周三','周四','周五','周六'];$('#timeText').textContent=d.toLocaleTimeString('zh-CN',{hour12:false});$('#dateText').textContent=(d.getMonth()+1).toString().padStart(2,'0')+'/'+d.getDate().toString().padStart(2,'0')+' '+w[d.getDay()]};clock();setInterval(clock,1000);

  var data={
    device:{title:'设备运行详情',trend:'近24小时在线率',kpis:[['设备总数','1,568'],['在线率','90.1%'],['故障设备','34']],rows:[['暖通主机组','在线','128 / 132'],['电梯系统','在线','36 / 36'],['给排水设备','维护','88 / 92'],['照明回路','在线','642 / 655'],['末端传感器','故障','34 个']]},
    security:{title:'安防监控详情',trend:'近24小时安防事件',kpis:[['摄像头','286'],['门禁点','48'],['周界设备','32']],rows:[['1号楼视频监控','在线','72 路'],['园区门禁','在线','48 / 48'],['东侧周界','告警','1 条'],['停车场视频','在线','46 路'],['访客闸机','在线','6 / 6']]},
    environment:{title:'环境监测详情',trend:'温湿度变化趋势',kpis:[['平均温度','24.6℃'],['平均湿度','56%'],['空气质量','优']],rows:[['1号楼办公区','正常','24.8℃'],['3号楼研发区','正常','25.1℃'],['中心广场','正常','PM2.5 28'],['地下车库','关注','CO 8ppm'],['5号楼宿舍区','正常','湿度 54%']]},
    access:{title:'人员通行详情',trend:'近7日人员通行趋势',kpis:[['今日通行','1,284'],['当前在园','936'],['访客人数','326']],rows:[['园区主入口','正常','526 人次'],['1号楼门厅','正常','312 人次'],['2号楼闸机','正常','241 人次'],['3号楼门厅','正常','188 人次'],['访客中心','正常','326 人']]},
    energy:{title:'园区能耗详情',trend:'近7日能耗趋势',kpis:[['今日能耗','23,460 kWh'],['较昨日','-3.2%'],['峰值负荷','1,286 kW']],rows:[['1号楼','偏高','5,820 kWh'],['2号楼','正常','4,160 kWh'],['3号楼','正常','4,680 kWh'],['4号楼','正常','3,960 kWh'],['5号楼','正常','3,240 kWh']]},
    alarm:{title:'告警事件详情',trend:'近7日告警数量',kpis:[['今日告警','12'],['未处置','3'],['闭环率','92%']],rows:[['1号楼消防烟感','重大','14:32'],['3号楼门禁异常','一般','11:03'],['东侧周界入侵','一般','09:27'],['4号楼设备离线','提示','昨日'],['5号楼电梯维保','提示','昨日']]},
    parking:{title:'停车管理详情',trend:'近24小时车位占用',kpis:[['总车位','620'],['已使用','428'],['空闲率','28%']],rows:[['A区地面停车','正常','126 / 180'],['B区地面停车','正常','88 / 140'],['地下停车场','正常','205 / 280'],['充电车位','关注','9 / 20'],['异常车位','异常','20']]},
    space:{title:'空间利用详情',trend:'工作日空间利用趋势',kpis:[['办公区','78%'],['会议室','62%'],['园区整体','68%']],rows:[['1号楼办公区','较高','82%'],['2号楼会议区','正常','64%'],['3号楼研发区','较高','79%'],['4号楼产业区','正常','66%'],['公共区域','正常','54%']]}
  };
  var modal=$('#modal');
  function badgeClass(v){return /重大|异常|故障/.test(v)?' danger':/一般|维护|关注|偏高|较高/.test(v)?' warn':''}
  function openModule(key){
    var d=data[key]; if(!d)return;
    $('#modalTitle').textContent=d.title; $('#trendTitle').textContent=d.trend;
    $('#modalKpis').innerHTML=d.kpis.map(function(x){return '<div><small>'+x[0]+'</small><b>'+x[1]+'</b></div>'}).join('');
    $('#modalTable').innerHTML=d.rows.map(function(x){return '<tr><td>'+x[0]+'</td><td><span class="badge'+badgeClass(x[1])+'">'+x[1]+'</span></td><td>'+x[2]+'</td></tr>'}).join('');
    var vals=key==='alarm'?[5,8,4,9,6,12,7,10,12]:key==='energy'?[48,55,52,60,72,68,64,70,76]:[38,44,42,55,51,67,63,72,69,78],pts=[];
    for(var i=0;i<vals.length;i++)pts.push([30+i*(460/(vals.length-1)),185-vals[i]*1.75]);
    var line='';for(var j=0;j<pts.length;j++)line+=(j?'L':'M')+pts[j][0].toFixed(1)+' '+pts[j][1].toFixed(1)+' ';
    var dots=pts.map(function(p){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="4" fill="#dffbff" stroke="#25d5ff" stroke-width="2"/>'}).join('');
    $('#modalChart').innerHTML='<path d="M30 35H500 M30 80H500 M30 125H500 M30 170H500" stroke="rgba(105,178,205,.16)"/><path d="'+line+'" fill="none" stroke="#25d5ff" stroke-width="3"/>'+dots;
    modal.classList.add('show');
  }
  $$('.drill-card').forEach(function(el){el.addEventListener('click',function(e){if(e.target.closest('.drill-card'))openModule(el.dataset.module)})});
  $('#closeModal').addEventListener('click',function(){modal.classList.remove('show')});modal.addEventListener('click',function(e){if(e.target===modal)modal.classList.remove('show')});

  var stats={1:{devices:326,people:218,energy:'5,820',alarm:1,floors:12},2:{devices:298,people:246,energy:'4,160',alarm:0,floors:8},3:{devices:384,people:306,energy:'4,680',alarm:1,floors:7},4:{devices:271,people:132,energy:'3,960',alarm:2,floors:6},5:{devices:189,people:344,energy:'3,240',alarm:0,floors:9}};
  var world=$('#world'),campus=$('#campusLayer'),floor=$('#floorLayer'),floorplan=$('#floorplanLayer'),stacks=$('#floorStacks'),rooms=$('#rooms'),devices=$('#devices'),info=$('#infoCard'),crumb=$('#crumb'),canvas=$('#sceneCanvas');
  var selected=null,level='campus',scale=1,panX=0,panY=0,dragging=false,sx=0,sy=0,spx=0,spy=0;
  function transform(){world.style.transform='translate('+panX+'px,'+panY+'px) scale('+scale+')'}
  function reset(){scale=1;panX=0;panY=0;transform()}
  function toast(t){var n=$('#toast');n.textContent=t;n.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(function(){n.classList.remove('show')},1700)}
  function choose(el){
    $$('.building').forEach(function(x){x.classList.remove('selected')});el.classList.add('selected');
    selected={name:el.dataset.building,type:el.dataset.type,index:+el.dataset.index};
    var s=stats[selected.index];$('#infoName').textContent=selected.name;$('#infoType').textContent=selected.type;$('#infoDevices').textContent=s.devices;$('#infoPeople').textContent=s.people;$('#infoEnergy').textContent=s.energy;$('#infoAlarm').textContent=s.alarm;info.classList.add('show');toast(selected.name+' 已选中，可进入楼宇');
  }
  $$('.building').forEach(function(el){el.addEventListener('click',function(e){e.stopPropagation();choose(el)})});
  $$('.marker').forEach(function(el){el.addEventListener('click',function(e){e.stopPropagation();toast(el.dataset.name)})});
  $('#enterBuilding').addEventListener('click',enterBuilding);
  function enterBuilding(){
    if(!selected)return;level='building';campus.classList.add('hidden');floorplan.classList.add('hidden');floor.classList.remove('hidden');info.classList.remove('show');stacks.innerHTML='';
    var count=stats[selected.index].floors;
    for(var i=0;i<count;i++){var y=470-i*29,x=355+i*2;stacks.insertAdjacentHTML('beforeend','<g class="floor-stack" data-floor="'+(i+1)+'" transform="translate('+x+' '+y+')"><polygon class="floor-top" points="0,0 260,-35 320,-5 60,31"/><polygon class="floor-face" points="60,31 320,-5 320,17 60,54"/><text x="190" y="16">F'+(i+1)+'</text></g>')}
    $$('.floor-stack',stacks).forEach(function(x){x.addEventListener('click',function(){enterFloor(+x.dataset.floor)})});
    crumb.innerHTML='<button data-level="campus">园区</button><span>›</span><button class="active">'+selected.name+'</button>';crumb.querySelector('[data-level="campus"]').addEventListener('click',backCampus);
    $('#statusText').textContent=selected.name+' · '+selected.type+' · 点击楼层继续下钻';reset();
  }
  function enterFloor(n){
    level='floor';floor.classList.add('hidden');floorplan.classList.remove('hidden');rooms.innerHTML='';devices.innerHTML='';
    var rs=[['办公室',220,145,180,110],['会议室',425,145,160,110],['机房',610,145,160,110],['开放办公区',220,280,365,190],['茶水/服务区',610,280,160,90],['走廊',610,390,160,80]];
    rs.forEach(function(r){rooms.insertAdjacentHTML('beforeend','<g><rect class="room" x="'+r[1]+'" y="'+r[2]+'" width="'+r[3]+'" height="'+r[4]+'" rx="4"/><text class="room-label" x="'+(r[1]+r[3]/2)+'" y="'+(r[2]+r[4]/2)+'">'+r[0]+'</text></g>')});
    [[280,190,''],[520,190,''],[680,185,'warn'],[330,360,''],[470,390,'alarm'],[700,325,'']].forEach(function(d){devices.insertAdjacentHTML('beforeend','<circle class="device-dot '+d[2]+'" cx="'+d[0]+'" cy="'+d[1]+'" r="7"/>')});
    crumb.innerHTML='<button data-level="campus">园区</button><span>›</span><button data-level="building">'+selected.name+'</button><span>›</span><button class="active">F'+n+'</button>';
    crumb.querySelector('[data-level="campus"]').addEventListener('click',backCampus);crumb.querySelector('[data-level="building"]').addEventListener('click',enterBuilding);
    $('#statusText').textContent=selected.name+' F'+n+' · 绿色正常 / 黄色关注 / 红色告警';toast('已进入 '+selected.name+' F'+n+' 楼层');reset();
  }
  function backCampus(){level='campus';campus.classList.remove('hidden');floor.classList.add('hidden');floorplan.classList.add('hidden');crumb.innerHTML='<button data-level="campus" class="active">园区</button>';$('#statusText').textContent='空间模型在线 · 支持拖拽 / 缩放 / 点击建筑';reset()}
  $('#zoomIn').addEventListener('click',function(){scale=Math.min(1.75,scale+.15);transform()});$('#zoomOut').addEventListener('click',function(){scale=Math.max(.7,scale-.15);transform()});$('#resetView').addEventListener('click',reset);
  canvas.addEventListener('wheel',function(e){e.preventDefault();scale=Math.max(.7,Math.min(1.8,scale+(e.deltaY<0?.08:-.08)));transform()},{passive:false});
  canvas.addEventListener('pointerdown',function(e){dragging=true;sx=e.clientX;sy=e.clientY;spx=panX;spy=panY;canvas.classList.add('dragging');canvas.setPointerCapture(e.pointerId)});
  canvas.addEventListener('pointermove',function(e){if(!dragging)return;panX=spx+e.clientX-sx;panY=spy+e.clientY-sy;transform()});
  canvas.addEventListener('pointerup',function(e){dragging=false;canvas.classList.remove('dragging');try{canvas.releasePointerCapture(e.pointerId)}catch(_){}});
  var themes={general:'综合态势',security:'安防消防',energy:'能耗环境',facility:'设备设施'};
  $$('#tabs button').forEach(function(b){b.addEventListener('click',function(){$$('#tabs button').forEach(function(x){x.classList.remove('active')});b.classList.add('active');var t=b.dataset.theme;$('#themeName').textContent=themes[t];$$('.marker').forEach(function(m){m.classList.toggle('dim',t!=='general'&&m.dataset.theme!==t)});toast('已切换至 '+themes[t])})});
  var tree=$('#trees');for(var i=0;i<46;i++){var x=155+(i*83)%690,y=125+(i*57)%390;if((x>430&&x<610&&y>310&&y<405)||(x>190&&x<410&&y>170&&y<320)||(x>645&&x<850&&y>145&&y<340))continue;tree.insertAdjacentHTML('beforeend','<circle class="tree" cx="'+x+'" cy="'+y+'" r="'+(4+i%3)+'" opacity="'+(.45+(i%4)*.1)+'"/>')}
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){modal.classList.remove('show');if(level!=='campus')backCampus()}});
})();