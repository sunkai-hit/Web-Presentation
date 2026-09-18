import * as THREE from "three";
import { OrbitControls } from "./vendor/three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "./vendor/three/examples/jsm/loaders/GLTFLoader.js";
import { EffectComposer } from "./vendor/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "./vendor/three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "./vendor/three/examples/jsm/postprocessing/UnrealBloomPass.js";

window.__IBMS_APP_STARTED=true;
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));

function updateClock(){
  const d=new Date(),wd=["周日","周一","周二","周三","周四","周五","周六"];
  $("#dateText").textContent=(d.getMonth()+1).toString().padStart(2,"0")+"/"+d.getDate().toString().padStart(2,"0")+" "+wd[d.getDay()];
  $("#timeText").textContent=d.toLocaleTimeString("zh-CN",{hour12:false});
}
updateClock();setInterval(updateClock,1000);

const detailData={
  device:{title:"设备运行详情",trend:"近24小时在线率",kpis:[["设备总数","1,568"],["在线率","90.1%"],["故障设备","34"]],rows:[["暖通主机组","在线","128 / 132"],["电梯系统","在线","36 / 36"],["给排水设备","维护","88 / 92"],["照明回路","在线","642 / 655"],["末端传感器","故障","34 个"]]},
  security:{title:"安防监控详情",trend:"近24小时安防事件",kpis:[["摄像头","286"],["门禁点","48"],["周界设备","32"]],rows:[["1号楼视频监控","在线","72 路"],["园区门禁","在线","48 / 48"],["东侧周界","告警","1 条"],["停车场视频","在线","46 路"],["访客闸机","在线","6 / 6"]]},
  environment:{title:"环境监测详情",trend:"温湿度变化趋势",kpis:[["平均温度","24.6℃"],["平均湿度","56%"],["空气质量","优"]],rows:[["1号楼办公区","正常","24.8℃"],["3号楼研发区","正常","25.1℃"],["中心广场","正常","PM2.5 28"],["地下车库","关注","CO 8ppm"],["5号楼宿舍区","正常","湿度 54%"]]},
  access:{title:"人员通行详情",trend:"近7日人员通行趋势",kpis:[["今日通行","1,284"],["当前在园","936"],["访客人数","326"]],rows:[["园区主入口","正常","526 人次"],["1号楼门厅","正常","312 人次"],["2号楼闸机","正常","241 人次"],["3号楼门厅","正常","188 人次"],["访客中心","正常","326 人"]]},
  energy:{title:"园区能耗详情",trend:"近7日能耗趋势",kpis:[["今日能耗","23,460 kWh"],["较昨日","-3.2%"],["峰值负荷","1,286 kW"]],rows:[["1号楼","偏高","5,820 kWh"],["2号楼","正常","4,160 kWh"],["3号楼","正常","4,680 kWh"],["4号楼","正常","3,960 kWh"],["5号楼","正常","3,240 kWh"]]},
  alarm:{title:"告警事件详情",trend:"近7日告警数量",kpis:[["今日告警","12"],["未处置","3"],["闭环率","92%"]],rows:[["1号楼消防烟感","重大","14:32"],["3号楼门禁异常","一般","11:03"],["东侧周界入侵","一般","09:27"],["4号楼设备离线","提示","昨日"],["5号楼电梯维保","提示","昨日"]]},
  parking:{title:"停车管理详情",trend:"近24小时车位占用",kpis:[["总车位","620"],["已使用","428"],["空闲率","28%"]],rows:[["A区地面停车","正常","126 / 180"],["B区地面停车","正常","88 / 140"],["地下停车场","正常","205 / 280"],["充电车位","关注","9 / 20"],["异常车位","异常","20"]]},
  space:{title:"空间利用详情",trend:"工作日空间利用趋势",kpis:[["办公区","78%"],["会议室","62%"],["园区整体","68%"]],rows:[["1号楼办公区","较高","82%"],["2号楼会议区","正常","64%"],["3号楼研发区","较高","79%"],["4号楼产业区","正常","66%"],["公共区域","正常","54%"]]}
};
const modal=$("#modal");
function badgeClass(v){return /重大|异常|故障/.test(v)?" danger":/一般|维护|关注|偏高|较高/.test(v)?" warn":""}
function openModule(key){
  const d=detailData[key];if(!d)return;
  $("#modalTitle").textContent=d.title;$("#trendTitle").textContent=d.trend;
  $("#modalKpis").innerHTML=d.kpis.map(x=>'<div><small>'+x[0]+'</small><b>'+x[1]+'</b></div>').join("");
  $("#modalTable").innerHTML=d.rows.map(x=>'<tr><td>'+x[0]+'</td><td><span class="badge'+badgeClass(x[1])+'">'+x[1]+'</span></td><td>'+x[2]+'</td></tr>').join("");
  const vals=key==="alarm"?[5,8,4,9,6,12,7,10,12]:key==="energy"?[48,55,52,60,72,68,64,70,76]:[38,44,42,55,51,67,63,72,69,78];
  const pts=vals.map((v,i)=>[30+i*(460/(vals.length-1)),185-v*1.75]);
  const line=pts.map((p,i)=>(i?"L":"M")+p[0].toFixed(1)+" "+p[1].toFixed(1)).join(" ");
  $("#modalChart").innerHTML='<path d="M30 35H500M30 80H500M30 125H500M30 170H500" stroke="rgba(105,178,205,.16)"/><path d="'+line+'" fill="none" stroke="#25d5ff" stroke-width="3"/>'+pts.map(p=>'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="4" fill="#dffbff" stroke="#25d5ff" stroke-width="2"/>').join("");
  modal.classList.add("show");
}
$$(".drill").forEach(el=>el.addEventListener("click",()=>openModule(el.dataset.module)));
$("#closeModal").addEventListener("click",()=>modal.classList.remove("show"));
modal.addEventListener("click",e=>{if(e.target===modal)modal.classList.remove("show")});

const viewer=$("#viewer");
if(location.protocol==="file:"){
  const loading=$("#loading");
  loading.querySelector("b").textContent="请使用 start-local.bat 启动本地服务";
  $("#loadingText").textContent="本地 GLB 模型不能直接通过 file:// 加载";
  throw new Error("IBMS v0.5.0 requires a local HTTP server. Run start-local.bat.");
}
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x06131d);
scene.fog=new THREE.FogExp2(0x06131d,0.0065);

const camera=new THREE.PerspectiveCamera(42,1,0.1,1000);
camera.position.set(92,74,100);

const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:"high-performance"});
renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.8));
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.15;
viewer.prepend(renderer.domElement);

const controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;
controls.dampingFactor=.07;
controls.target.set(0,7,0);
controls.minDistance=55;
controls.maxDistance=210;
controls.maxPolarAngle=Math.PI*.48;
controls.minPolarAngle=Math.PI*.18;
controls.autoRotate=true;
controls.autoRotateSpeed=.55;
controls.enablePan=true;
controls.screenSpacePanning=false;

const composer=new EffectComposer(renderer);
composer.addPass(new RenderPass(scene,camera));
const bloom=new UnrealBloomPass(new THREE.Vector2(1,1),.7,.55,.85);
composer.addPass(bloom);

scene.add(new THREE.HemisphereLight(0x9bdfff,0x0b1722,2.1));
const sun=new THREE.DirectionalLight(0xe7fbff,4.2);
sun.position.set(75,110,50);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
sun.shadow.camera.left=-110;sun.shadow.camera.right=110;sun.shadow.camera.top=110;sun.shadow.camera.bottom=-110;scene.add(sun);
const fill=new THREE.DirectionalLight(0x189ed0,2.4);fill.position.set(-80,45,-55);scene.add(fill);
const rim=new THREE.PointLight(0x19d8ff,1100,130,2);rim.position.set(0,35,0);scene.add(rim);

const world=new THREE.Group();scene.add(world);
const buildingGroup=new THREE.Group();world.add(buildingGroup);
const natureGroup=new THREE.Group();world.add(natureGroup);
const markerGroups={security:new THREE.Group(),energy:new THREE.Group(),facility:new THREE.Group()};
Object.values(markerGroups).forEach(g=>world.add(g));

function mat(color,metal=.05,rough=.72,emissive=0x000000,ei=0){
  return new THREE.MeshStandardMaterial({color,metalness:metal,roughness:rough,emissive,emissiveIntensity:ei});
}
const ground=new THREE.Mesh(new THREE.PlaneGeometry(190,145),mat(0x10272c,.02,.95));
ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;ground.position.y=-.1;world.add(ground);

const campusBase=new THREE.Mesh(new THREE.BoxGeometry(158,1.1,112),mat(0x17363c,.08,.86));
campusBase.position.y=-.62;campusBase.receiveShadow=true;world.add(campusBase);

function addRoad(x,z,w,d,rot=0){
  const m=new THREE.Mesh(new THREE.BoxGeometry(w,.16,d),mat(0x27343b,.05,.9));
  m.position.set(x,.04,z);m.rotation.y=rot;m.receiveShadow=true;world.add(m);return m;
}
addRoad(0,0,13,108);addRoad(-44,0,10,106);addRoad(43,0,10,106);addRoad(0,36,145,10);addRoad(0,-37,145,10);
for(let i=-4;i<=4;i++){
  const line=new THREE.Mesh(new THREE.BoxGeometry(.25,.03,8),new THREE.MeshBasicMaterial({color:0x8cc5d3}));
  line.position.set(0,.15,i*11);line.material.transparent=true;line.material.opacity=.35;world.add(line);
}
const plaza=new THREE.Mesh(new THREE.CylinderGeometry(17,17,.5,64),mat(0x1b5969,.12,.62));plaza.position.set(1,.26,0);world.add(plaza);
const pool=new THREE.Mesh(new THREE.CylinderGeometry(10.5,10.5,.34,64),new THREE.MeshPhysicalMaterial({color:0x167da2,roughness:.15,metalness:.05,transmission:.05,transparent:true,opacity:.82,emissive:0x0c5778,emissiveIntensity:.3}));
pool.position.set(1,.56,0);world.add(pool);
const poolRing=new THREE.Mesh(new THREE.TorusGeometry(11.3,.23,10,64),new THREE.MeshBasicMaterial({color:0x46dcff,toneMapped:false}));
poolRing.rotation.x=Math.PI/2;poolRing.position.set(1,.8,0);world.add(poolRing);

const grid=new THREE.GridHelper(180,36,0x1c809e,0x123f4d);grid.position.y=.02;
grid.material.transparent=true;grid.material.opacity=.17;world.add(grid);

function addParking(cx,cz,cols,rows,rotation=0){
  const g=new THREE.Group();g.position.set(cx,.12,cz);g.rotation.y=rotation;
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
    const border=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(4.5,7.5)),new THREE.LineBasicMaterial({color:0x387b8e,transparent:true,opacity:.45}));
    border.rotation.x=-Math.PI/2;border.position.set((c-(cols-1)/2)*5.1,.02,(r-(rows-1)/2)*8.1);g.add(border);
    if((r+c)%3!==0){
      const car=new THREE.Mesh(new THREE.BoxGeometry(2.2,.7,4.6),mat((r+c)%2?0x587b88:0x244f63,.35,.45));
      car.position.set((c-(cols-1)/2)*5.1,.48,(r-(rows-1)/2)*8.1);g.add(car);
    }
  }world.add(g);
}
addParking(58,-17,4,4,.02);addParking(-60,12,3,3,-.04);

function addLamp(x,z){
  const pole=new THREE.Mesh(new THREE.CylinderGeometry(.11,.14,3.7,8),mat(0x536874,.5,.45));pole.position.set(x,1.85,z);world.add(pole);
  const bulb=new THREE.Mesh(new THREE.SphereGeometry(.22,10,8),new THREE.MeshBasicMaterial({color:0x9eeeff,toneMapped:false}));bulb.position.set(x,3.72,z);world.add(bulb);
}
for(let z=-46;z<=46;z+=14){addLamp(-7,z);addLamp(7,z)}

const ASSET_BASE="./assets/models/";
const loader=new GLTFLoader();
$("#runtimeState").textContent="Three.js 本地运行库：已就绪";
$("#modelState").textContent="本地 GLB 模型：开始加载";
const assetFiles=["b_large.glb","b_medium.glb","b_small.glb","tree1.glb","tree2.glb","tree3.glb","bush.glb"];
const templates=new Map();
let loadedCount=0;
$("#loadingText").textContent="0 / "+assetFiles.length;
let failedCount=0;
function withTimeout(promise,ms,label){
  return Promise.race([
    promise,
    new Promise((_,reject)=>setTimeout(()=>reject(new Error(label+" load timeout")),ms))
  ]);
}
async function loadAsset(file){
  try{
    const gltf=await withTimeout(loader.loadAsync(ASSET_BASE+file),30000,file);
    loadedCount++;
    $("#loadingText").textContent=loadedCount+" / "+assetFiles.length+" 已加载";
    $("#modelState").textContent="本地 GLB 模型："+loadedCount+"/"+assetFiles.length;
    templates.set(file,gltf.scene);
    return gltf.scene;
  }catch(err){
    failedCount++;
    loadedCount++;
    console.error("Model load failed:",file,err);
    $("#loadingText").textContent=loadedCount+" / "+assetFiles.length+"，失败 "+failedCount;
    $("#modelState").textContent="本地 GLB 模型：失败 "+failedCount+" 个";
    return null;
  }
}
const directBimSmoke=new URLSearchParams(location.search).get("bim")==="1";
if(!directBimSmoke){
  await Promise.all(assetFiles.map(loadAsset));
}else{
  $("#loadingText").textContent="BIM直达测试：跳过园区LOD";
  $("#modelState").textContent="园区LOD：测试模式跳过";
}
if(!directBimSmoke&&failedCount===assetFiles.length){
  $("#loading").classList.add("error");
  $("#loadingTitle").textContent="本地模型加载失败";
  $("#loadingText").textContent="7 个 GLB 模型均未能读取";
  $("#loadError").textContent="请确认使用 start-local.bat 启动，并检查 assets/models 目录。";
  throw new Error("All local GLB assets failed to load.");
}
window.__IBMS_MODELS_READY=true;
clearTimeout(window.__IBMS_BOOT_WATCHDOG);

function cloneModel(file){
  const src=templates.get(file);if(!src)return null;
  const c=src.clone(true);
  c.traverse(o=>{
    if(o.isMesh){
      o.material=o.material.clone();
      o.castShadow=true;o.receiveShadow=true;
      if("roughness" in o.material)o.material.roughness=Math.max(.48,o.material.roughness??.7);
      o.userData.baseEmissive=o.material.emissive?.clone?.()||new THREE.Color(0x000000);
      o.userData.baseEI=o.material.emissiveIntensity||0;
    }
  });
  return c;
}
function fallbackBuilding(){
  const g=new THREE.Group();
  const body=new THREE.Mesh(new THREE.BoxGeometry(20,18,16),mat(0x3f6674,.12,.6));body.position.y=9;body.castShadow=true;g.add(body);
  const roof=new THREE.Mesh(new THREE.BoxGeometry(16,2,12),mat(0x708f99,.18,.48));roof.position.y=19;g.add(roof);
  return g;
}
function normalizeModel(obj,targetFootprint){
  const box=new THREE.Box3().setFromObject(obj),size=new THREE.Vector3();box.getSize(size);
  const denom=Math.max(size.x,size.z)||1,scale=targetFootprint/denom;
  obj.scale.setScalar(scale);
  const box2=new THREE.Box3().setFromObject(obj);
  obj.position.y-=box2.min.y;
}
const buildingDefs=[
  {id:1,name:"1号楼",type:"综合办公楼",file:"b_large.glb",pos:[42,12],rot:-.05,size:33,stats:[326,218,"5,820",1]},
  {id:2,name:"2号楼",type:"总部办公楼",file:"b_medium.glb",pos:[8,38],rot:.1,size:27,stats:[298,246,"4,160",0]},
  {id:3,name:"3号楼",type:"研发中心",file:"b_medium.glb",pos:[-35,18],rot:-.14,size:28,stats:[384,306,"4,680",1]},
  {id:4,name:"4号楼",type:"产业服务中心",file:"b_small.glb",pos:[-32,-29],rot:.08,size:24,stats:[271,132,"3,960",2]},
  {id:5,name:"5号楼",type:"人才公寓",file:"b_medium.glb",pos:[34,-31],rot:-.08,size:26,stats:[189,344,"3,240",0]},
  {id:6,name:"6号楼",type:"访客服务中心",file:"b_small.glb",pos:[-7,-52],rot:0,size:18,stats:[112,78,"1,680",0]}
];
const buildings=[];
buildingDefs.forEach(def=>{
  const obj=cloneModel(def.file)||fallbackBuilding();
  normalizeModel(obj,def.size);obj.position.x=def.pos[0];obj.position.z=def.pos[1];obj.rotation.y=def.rot;
  obj.userData.building=def;
  obj.traverse(o=>{if(o.isMesh)o.userData.buildingRoot=obj});
  buildingGroup.add(obj);buildings.push(obj);
});

function placeNature(){
  const files=["tree1.glb","tree2.glb","tree3.glb"];
  const spots=[];
  for(let x=-70;x<=70;x+=10){spots.push([x,-50],[x,50])}
  for(let z=-42;z<=42;z+=11){spots.push([-70,z],[70,z])}
  [[-13,23],[16,24],[-15,-23],[17,-21],[-55,-22],[56,31],[-55,36],[57,-40],[-2,53]].forEach(p=>spots.push(p));
  spots.forEach((p,i)=>{
    const t=cloneModel(files[i%files.length]);
    if(!t)return;
    normalizeModel(t,5.5+(i%3)*.8);t.position.set(p[0],0,p[1]);t.rotation.y=(i*.77)%6.28;natureGroup.add(t);
  });
  for(let i=0;i<18;i++){
    const b=cloneModel("bush.glb");if(!b)break;
    normalizeModel(b,2.2);const a=i/18*Math.PI*2,r=20+(i%2)*3;b.position.set(1+Math.cos(a)*r,0,Math.sin(a)*r);natureGroup.add(b);
  }
}
placeNature();

function makeMarker(category,x,z,color,label){
  const g=new THREE.Group();g.position.set(x,.35,z);g.userData={category,label,pulseOffset:Math.random()*10};
  const pillar=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,5,8),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.55,toneMapped:false}));pillar.position.y=2.5;g.add(pillar);
  const orb=new THREE.Mesh(new THREE.SphereGeometry(.48,16,12),new THREE.MeshBasicMaterial({color,toneMapped:false}));orb.position.y=5.1;g.add(orb);
  const ring=new THREE.Mesh(new THREE.RingGeometry(.65,.9,32),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.6,side:THREE.DoubleSide,toneMapped:false}));ring.rotation.x=-Math.PI/2;ring.position.y=.05;g.add(ring);g.userData.ring=ring;
  markerGroups[category].add(g);return g;
}
const markers=[
 makeMarker("security",48,4,0xff5262,"消防烟感报警"),
 makeMarker("security",-50,35,0x22e2b1,"周界防区正常"),
 makeMarker("security",-28,7,0x22e2b1,"门禁在线"),
 makeMarker("energy",16,29,0xffcc54,"能耗采集"),
 makeMarker("energy",-25,-18,0xffcc54,"分项计量"),
 makeMarker("facility",54,-19,0x24d8ff,"停车场"),
 makeMarker("facility",-8,-47,0x24d8ff,"访客闸机"),
 makeMarker("facility",33,26,0x24d8ff,"视频监控")
];

const labels=$("#labels");
buildings.forEach((b,i)=>{
  const d=b.userData.building,el=document.createElement("div");el.className="building-label";el.dataset.id=d.id;
  el.innerHTML="<b>"+d.name+"</b><small>"+d.type+"</small>";labels.appendChild(el);b.userData.labelEl=el;
});


/* =========================
   v0.5.0 Digital Twin Drilldown
   Campus LOD → Building BIM → Floor → System → Device
   ========================= */
const bimLayer=new THREE.Group();
bimLayer.visible=false;
scene.add(bimLayer);

let viewMode="campus";
let currentBimTab="overview";
let bimLoaded=false;
let bimLoadingPromise=null;
let bimRoot=null;
let bimMeta=null;
let bimBounds=null;
let bimMeshes=[];
let bimPickables=[];
let metaById=new Map();
let floorByGuid=new Map();
let floorDefs=[];
let selectedFloorIndex=null;
let activeFloorIndex=null;
let floorsExploded=false;
let bimParseMs=0;
let bimFetchMs=0;
let prefetchedBimBuffer=null;
let prefetchPromise=null;

let currentSystem="fire";
let currentScope="building";
const systemGroups={};
const deviceRegistry=[];
const systemPickables=[];
let selectedDevice=null;
let selectedDeviceOriginalScale=null;
let selectedBimMesh=null;
let selectedBimRestoreMaterial=null;
let toastTimer=null;

const BIM_MODEL_URL="./assets/bim/Schependomlaan.glb";
const BIM_META_URL="./assets/bim/Schependomlaan.json";

const SYSTEM_CONFIG={
  fire:{
    name:"消防系统",short:"消防",color:0xff5d6c,ok:"系统正常",
    legend:[["#ff5d6c","消防给水/喷淋"],["#ffb547","火灾自动报警"],["#03affe","水压/液位监测"]]
  },
  security:{
    name:"安防系统",short:"安防",color:0x03affe,ok:"在线率 98%",
    legend:[["#03affe","视频监控"],["#32d583","门禁控制"],["#ffb547","入侵探测"]]
  },
  hvac:{
    name:"暖通系统",short:"暖通",color:0x63c7ff,ok:"运行正常",
    legend:[["#63c7ff","送风系统"],["#32d583","回风/新风"],["#91afc6","末端设备"]]
  },
  power:{
    name:"电气系统",short:"电气",color:0xffb547,ok:"负载正常",
    legend:[["#ffb547","动力配电"],["#03affe","弱电/控制"],["#32d583","计量监测"]]
  }
};

const floorStatsSeed=[
  {people:0,energy:420,alarm:0},
  {people:86,energy:960,alarm:1},
  {people:72,energy:880,alarm:0},
  {people:64,energy:810,alarm:0},
  {people:38,energy:620,alarm:0},
  {people:3,energy:260,alarm:0}
];

function nextFrame(){return new Promise(r=>requestAnimationFrame(()=>r()))}
function showToast(text,type=""){
  const el=$("#twinToast");if(!el)return;
  el.textContent=text;el.className="twin-toast show"+(type?" "+type:"");
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.className="twin-toast",2400);
}
function updateDetailLoading(text,error=false){
  const box=$("#detailLoading");
  $("#detailLoadingText").textContent=text;
  box.classList.toggle("error",error);
}
function showDetailLoading(show=true){$("#detailLoading").classList.toggle("show",show)}
function updatePerfChip(text){const el=$("#perfChip");if(el)el.textContent=text}

function setRenderProfile(mode){
  const px=mode==="bim"?Math.min(window.devicePixelRatio,1.15):Math.min(window.devicePixelRatio,1.8);
  renderer.setPixelRatio(px);
  renderer.shadowMap.enabled=mode!=="bim";
  const rect=viewer.getBoundingClientRect();
  renderer.setSize(rect.width,rect.height,false);
  composer.setSize(rect.width,rect.height);
}

function prefetchBimBinary(){
  if(prefetchPromise||bimLoaded)return prefetchPromise;
  const t0=performance.now();
  updatePerfChip("BIM GLB · 后台预取中");
  prefetchPromise=fetch(BIM_MODEL_URL,{cache:"force-cache"})
    .then(r=>{if(!r.ok)throw new Error("BIM GLB HTTP "+r.status);return r.arrayBuffer()})
    .then(buf=>{
      prefetchedBimBuffer=buf;
      bimFetchMs=performance.now()-t0;
      updatePerfChip("BIM GLB · 已预取 "+(buf.byteLength/1024/1024).toFixed(1)+"MB");
      return buf;
    })
    .catch(err=>{
      console.warn("BIM prefetch skipped",err);
      updatePerfChip("Campus LOD · Ready");
      return null;
    });
  return prefetchPromise;
}
if(!directBimSmoke)setTimeout(()=>prefetchBimBinary(),2600);

function parseBimBuffer(buffer){
  return new Promise((resolve,reject)=>{
    const l=new GLTFLoader();
    l.parse(buffer,"./assets/bim/",resolve,reject);
  });
}
async function loadBimGeometry(){
  const t0=performance.now();
  if(prefetchedBimBuffer){
    updateDetailLoading("解析二进制 BIM · 已命中预取缓存");
    const gltf=await parseBimBuffer(prefetchedBimBuffer);
    bimParseMs=performance.now()-t0;
    return gltf;
  }
  updateDetailLoading("读取二进制 BIM 模型...");
  const fetchStart=performance.now();
  const res=await fetch(BIM_MODEL_URL,{cache:"force-cache"});
  if(!res.ok)throw new Error("BIM GLB HTTP "+res.status);
  const reader=res.body?.getReader();
  let buffer;
  if(reader&&res.headers.get("Content-Length")){
    const total=Number(res.headers.get("Content-Length")),chunks=[];let loaded=0;
    while(true){
      const {done,value}=await reader.read();if(done)break;
      chunks.push(value);loaded+=value.byteLength;
      updateDetailLoading("下载 BIM "+Math.round(loaded/total*100)+"% · "+(loaded/1024/1024).toFixed(1)+"MB");
    }
    buffer=new Uint8Array(loaded);let off=0;for(const c of chunks){buffer.set(c,off);off+=c.byteLength}
    buffer=buffer.buffer;
  }else buffer=await res.arrayBuffer();
  bimFetchMs=performance.now()-fetchStart;
  prefetchedBimBuffer=buffer;
  updateDetailLoading("BIM下载完成，开始解析二进制几何...");
  await nextFrame();
  const parseStart=performance.now();
  const gltf=await parseBimBuffer(buffer);
  bimParseMs=performance.now()-parseStart;
  return gltf;
}

function buildMetaIndex(meta){
  metaById=new Map((meta.metaObjects||[]).map(o=>[o.id,o]));
  const storeys=(meta.metaObjects||[]).filter(o=>o.type==="IfcBuildingStorey");
  const cache=new Map();
  function resolveFloor(id){
    if(cache.has(id))return cache.get(id);
    let p=metaById.get(id),guard=0;
    while(p&&guard++<12){
      if(p.type==="IfcBuildingStorey"){cache.set(id,p.id);return p.id}
      p=p.parent?metaById.get(p.parent):null;
    }
    cache.set(id,null);return null;
  }
  floorByGuid=new Map();
  (meta.metaObjects||[]).forEach(o=>floorByGuid.set(o.id,resolveFloor(o.id)));
  floorDefs=storeys.map((o,i)=>({
    id:o.id,name:o.name||("楼层 "+(i+1)),meshes:[],index:i,avgY:0,elementCount:0
  }));
}
function findIFCGuid(obj){
  let p=obj,guard=0;
  while(p&&guard++<10){
    const name=p.name||"";
    const matches=name.match(/[0-9A-Za-z_$]{22}/g)||[];
    for(const token of matches)if(metaById.has(token))return token;
    p=p.parent;
  }
  return null;
}
function normalizeBimModel(root){
  root.updateMatrixWorld(true);
  let box=new THREE.Box3().setFromObject(root),size=new THREE.Vector3(),center=new THREE.Vector3();
  box.getSize(size);
  const scale=82/Math.max(size.x,size.z,1);
  root.scale.multiplyScalar(scale);
  root.updateMatrixWorld(true);
  box=new THREE.Box3().setFromObject(root);box.getCenter(center);
  root.position.x-=center.x;root.position.z-=center.z;root.position.y-=box.min.y;
  root.updateMatrixWorld(true);
  return new THREE.Box3().setFromObject(root);
}

const materialVariantCache=new WeakMap();
function materialVariant(base,opacity,tint){
  if(!base)return base;
  let cache=materialVariantCache.get(base);
  if(!cache){cache=new Map();materialVariantCache.set(base,cache)}
  const key=opacity.toFixed(2)+":"+(tint??"none");
  if(cache.has(key))return cache.get(key);
  const m=base.clone();
  m.opacity=Math.max(.02,(base.opacity??1)*opacity);
  m.transparent=opacity<.999||base.transparent;
  m.depthWrite=opacity>.34?(base.depthWrite??true):false;
  if(tint!==null&&tint!==undefined){
    if(m.emissive){m.emissive.setHex(tint);m.emissiveIntensity=.22}
    else if(m.color)m.color.lerp(new THREE.Color(tint),.18);
  }
  m.needsUpdate=true;cache.set(key,m);return m;
}
function baseMaterialOf(mesh){
  if(!mesh.userData.__baseMaterial)mesh.userData.__baseMaterial=mesh.material;
  return mesh.userData.__baseMaterial;
}
function setMeshVisual(mesh,opacity=1,tint=null){
  const base=baseMaterialOf(mesh);
  if(opacity>=.999&&(tint===null||tint===undefined)){mesh.material=base;return}
  mesh.material=Array.isArray(base)
    ?base.map(m=>materialVariant(m,opacity,tint))
    :materialVariant(base,opacity,tint);
}
function resetBimElementHighlight(){
  if(selectedBimMesh&&selectedBimRestoreMaterial)selectedBimMesh.material=selectedBimRestoreMaterial;
  selectedBimMesh=null;selectedBimRestoreMaterial=null;
}
function highlightBimElement(mesh){
  resetBimElementHighlight();
  selectedBimMesh=mesh;selectedBimRestoreMaterial=mesh.material;
  const source=Array.isArray(mesh.material)?mesh.material:[mesh.material];
  const clones=source.map(m=>{
    const c=m.clone();
    if(c.emissive){c.emissive.setHex(0x03affe);c.emissiveIntensity=.75}
    else if(c.color)c.color.lerp(new THREE.Color(0x03affe),.4);
    return c;
  });
  mesh.material=Array.isArray(mesh.material)?clones:clones[0];
}

function assignMeshesToFloors(){
  const byId=new Map(floorDefs.map(f=>[f.id,f]));
  bimMeshes=[];bimPickables=[];
  bimRoot.updateMatrixWorld(true);
  bimRoot.traverse(o=>{
    if(!o.isMesh)return;
    o.castShadow=false;o.receiveShadow=false;
    o.userData.__basePosition=o.position.clone();
    o.userData.__targetOffsetX=0;o.userData.__targetOffsetY=0;
    o.userData.__baseMaterial=o.material;
    const guid=findIFCGuid(o),floorId=guid?floorByGuid.get(guid):null;
    o.userData.ifcGuid=guid||null;o.userData.floorId=floorId||null;o.userData.ifcMeta=guid?metaById.get(guid)||null:null;
    bimMeshes.push(o);bimPickables.push(o);
    if(floorId&&byId.has(floorId))byId.get(floorId).meshes.push(o);
  });
  floorDefs.forEach(f=>{
    let sum=0,count=0;
    f.meshes.forEach(m=>{const b=new THREE.Box3().setFromObject(m);if(!b.isEmpty()){sum+=(b.min.y+b.max.y)/2;count++}});
    f.avgY=count?sum/count:0;f.elementCount=f.meshes.length;
  });
  const valid=floorDefs.filter(f=>f.meshes.length);
  if(valid.length<3){
    const box=new THREE.Box3().setFromObject(bimRoot),h=(box.max.y-box.min.y)/Math.max(floorDefs.length,1);
    floorDefs.forEach((f,i)=>{f.meshes=[];f.avgY=box.min.y+h*(i+.5)});
    bimMeshes.forEach(m=>{
      const b=new THREE.Box3().setFromObject(m),y=(b.min.y+b.max.y)/2;
      let best=floorDefs[0],dist=Infinity;floorDefs.forEach(f=>{const d=Math.abs(y-f.avgY);if(d<dist){dist=d;best=f}});
      m.userData.floorId=best.id;best.meshes.push(m);
    });
  }else{
    const known=valid.slice().sort((a,b)=>a.avgY-b.avgY);
    bimMeshes.filter(m=>!m.userData.floorId).forEach(m=>{
      const b=new THREE.Box3().setFromObject(m),y=(b.min.y+b.max.y)/2;
      let best=known[0],dist=Infinity;known.forEach(f=>{const d=Math.abs(y-f.avgY);if(d<dist){dist=d;best=f}});
      m.userData.floorId=best.id;best.meshes.push(m);
    });
  }
  floorDefs.forEach(f=>f.elementCount=f.meshes.length);
  floorDefs.sort((a,b)=>a.avgY-b.avgY);floorDefs.forEach((f,i)=>f.index=i);
}
function floorStats(index){
  const seed=floorStatsSeed[index%floorStatsSeed.length]||floorStatsSeed[0];
  return {people:seed.people,energy:seed.energy,alarm:seed.alarm,devices:72+index*9};
}
function renderFloorList(){
  $("#floorList").innerHTML=floorDefs.map((f,i)=>{
    const st=floorStats(i);
    return '<button class="floor-item" data-floor="'+i+'"><span><b>'+f.name+'</b><small>构件 '+f.elementCount+' · 设备 '+st.devices+'</small></span><em>抽屉查看 ›</em></button>';
  }).join("");
  $$(".floor-item").forEach(btn=>btn.addEventListener("click",()=>selectFloor(Number(btn.dataset.floor))));
}
function renderFloorScopeCard(index){
  const box=$("#floorScopeCard");if(!box)return;
  if(index===null||!floorDefs[index]){box.innerHTML='<div class="empty">请选择一个楼层</div>';return}
  const f=floorDefs[index],st=floorStats(index);
  box.innerHTML='<div class="floor-scope-inner"><header><div><b>'+f.name+'</b><small>'+f.elementCount+' BIM构件</small></div><em>● 正常</em></header>'+
    '<div class="floor-scope-kpis"><div><small>设备</small><b>'+st.devices+'</b></div><div><small>人员</small><b>'+st.people+'</b></div><div><small>告警</small><b>'+st.alarm+'</b></div></div>'+
    '<button id="enterFloorScope">进入该楼层 · 查看专业系统</button></div>';
  $("#enterFloorScope").addEventListener("click",enterSelectedFloor);
}
function resetFloorTargets(clearActive=true){
  selectedFloorIndex=null;floorsExploded=false;if(clearActive)activeFloorIndex=null;
  $$(".floor-item").forEach(b=>b.classList.remove("active"));renderFloorScopeCard(null);
  bimMeshes.forEach(m=>{m.userData.__targetOffsetX=0;m.userData.__targetOffsetY=0;setMeshVisual(m,1)});
}
function selectFloor(index){
  if(!floorDefs[index])return;
  closeDevice(false);hideAllSystems();currentBimTab="floors";
  selectedFloorIndex=index;
  $$(".floor-item").forEach((b,i)=>b.classList.toggle("active",i===index));
  const f=floorDefs[index];
  bimMeshes.forEach(m=>{
    const same=m.userData.floorId===f.id;
    m.userData.__targetOffsetX=same?12:0;m.userData.__targetOffsetY=0;
    setMeshVisual(m,same?1:.16,same?0x073c52:null);
  });
  renderFloorScopeCard(index);updateTwinNavigation();
  if(f.meshes.length){
    const box=new THREE.Box3();f.meshes.forEach(m=>box.expandByObject(m));
    flyCameraToBox(box,1.85,new THREE.Vector3(1,.5,1));
  }
}
function enterSelectedFloor(){
  if(selectedFloorIndex===null)return;
  activeFloorIndex=selectedFloorIndex;currentScope="floor";
  showToast("已进入 "+floorDefs[activeFloorIndex].name+"，专业系统将限定到当前楼层");
  setBimTab("systems");setSystemMode(currentSystem);
}
function explodeAllFloors(){
  closeDevice(false);hideAllSystems();activeFloorIndex=null;selectedFloorIndex=null;currentScope="building";floorsExploded=true;
  $$(".floor-item").forEach(b=>b.classList.remove("active"));renderFloorScopeCard(null);
  const mid=(floorDefs.length-1)/2;
  bimMeshes.forEach(m=>{
    const idx=floorDefs.findIndex(f=>f.id===m.userData.floorId);
    m.userData.__targetOffsetX=0;m.userData.__targetOffsetY=idx>=0?(idx-mid)*3.0:0;setMeshVisual(m,.92);
  });
  updateTwinNavigation();homeBimView();
}

/* -------- System & device layer -------- */
function floorY(index){
  const f=floorDefs[index];return f&&Number.isFinite(f.avgY)?f.avgY:(bimBounds.min.y+(index+.5)*(bimBounds.max.y-bimBounds.min.y)/Math.max(1,floorDefs.length));
}
function systemDevices(key=currentSystem){
  return deviceRegistry.filter(d=>d.system===key&&(currentScope!=="floor"||activeFloorIndex===null||d.floorIndex===activeFloorIndex));
}
function addPipe(parent,a,b,r,color,floorIndex,key){
  const dir=b.clone().sub(a),len=dir.length(),mid=a.clone().add(b).multiplyScalar(.5);
  const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,len,8),new THREE.MeshStandardMaterial({color,roughness:.45,metalness:.12,emissive:color,emissiveIntensity:.32}));
  mesh.position.copy(mid);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.clone().normalize());
  mesh.userData.systemLine={floorIndex,system:key};mesh.castShadow=false;parent.add(mesh);return mesh;
}
function telemetryFor(type,index){
  if(type==="smoke")return [["烟雾浓度",(0.04+index*.003).toFixed(2),"ppm"],["温度",(23.6+index*.15).toFixed(1),"℃"],["电池",96-index%7,"%"],["信号",-46-index%8,"dBm"]];
  if(type==="sprinkler")return [["末端压力",(0.42-index*.004).toFixed(2),"MPa"],["阀门","开启",""],["流量","0.0","L/s"],["巡检","正常",""]];
  if(type==="camera")return [["码率",(3.2+index*.08).toFixed(1),"Mbps"],["帧率","25","fps"],["存储","正常",""],["信号","在线",""]];
  if(type==="access")return [["门状态","关闭",""],["今日通行",34+index*2,"人次"],["控制器","在线",""],["电压","12.1","V"]];
  if(type==="fcu")return [["送风温度",(18.2+index*.1).toFixed(1),"℃"],["风速","2档",""],["阀门","62","%"],["功率","0.42","kW"]];
  if(type==="panel")return [["电压","380","V"],["电流",32+index,"A"],["功率因数","0.96",""],["温度",31+index%3,"℃"]];
  return [["状态","正常",""],["在线","是",""],["信号","良好",""],["巡检","正常",""]];
}
function trendFor(index){return Array.from({length:14},(_,i)=>34+((index*7+i*11)%48))}
function createDevice(key,type,label,pos,color,parent,floorIndex,seq,shape="sphere"){
  let geo;
  if(shape==="box")geo=new THREE.BoxGeometry(1.05,.78,1.05);
  else if(shape==="cone")geo=new THREE.ConeGeometry(.55,1.2,10);
  else geo=new THREE.SphereGeometry(.48,12,9);
  const material=new THREE.MeshStandardMaterial({color,roughness:.34,metalness:.16,emissive:color,emissiveIntensity:.65});
  const mesh=new THREE.Mesh(geo,material);mesh.position.copy(pos);
  const code=key.toUpperCase()+"-"+String(floorIndex+1).padStart(2,"0")+"-"+String(seq).padStart(3,"0");
  const floor=floorDefs[floorIndex];
  const d={
    id:code,code,system:key,type,label,mesh,floorIndex,floorId:floor?.id,floor:floor?.name||("F"+(floorIndex+1)),
    room:["走廊东区","核心筒","办公区A","设备间","公共区"][seq%5],
    status:"online",normalColor:color,telemetry:telemetryFor(type,seq),
    trend:trendFor(seq),events:[{time:"08:30",text:"自动巡检通过"},{time:"昨日 17:42",text:"状态上报正常"}],workOrder:null
  };
  mesh.userData.systemDevice=d;mesh.userData.devicePulse=seq*.61;
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.78,.055,8,24),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.5,toneMapped:false}));
  ring.rotation.x=Math.PI/2;ring.position.y=-.5;ring.userData.deviceRing=true;mesh.add(ring);
  parent.add(mesh);deviceRegistry.push(d);systemPickables.push(mesh);return d;
}
function ensureSystemLayer(key){
  if(systemGroups[key])return systemGroups[key];
  const cfg=SYSTEM_CONFIG[key],g=new THREE.Group();g.name="system-"+key;g.visible=false;systemGroups[key]=g;bimLayer.add(g);
  const box=bimBounds,center=new THREE.Vector3();box.getCenter(center);
  const minX=box.min.x+4,maxX=box.max.x-4,minZ=box.min.z+3,maxZ=box.max.z-3;
  let seq=0;
  floorDefs.forEach((f,fi)=>{
    const y=floorY(fi)+1.15,spanX=maxX-minX;
    if(key==="fire"){
      addPipe(g,new THREE.Vector3(minX,y,center.z),new THREE.Vector3(maxX,y,center.z),.14,cfg.color,fi,key);
      addPipe(g,new THREE.Vector3(center.x,y,minZ),new THREE.Vector3(center.x,y,maxZ),.12,cfg.color,fi,key);
      for(let n=0;n<6;n++){
        const x=minX+(n+.7)*spanX/6.7,z=n%2?center.z+4.5:center.z-4.5;
        createDevice(key,"sprinkler","喷淋头 "+(fi+1)+"-"+(n+1),new THREE.Vector3(x,y-.25,z),0xff5d6c,g,fi,++seq);
      }
      for(let n=0;n<3;n++){
        const x=minX+(n+1)*spanX/4;
        createDevice(key,"smoke","智能烟感 "+(fi+1)+"-"+(n+1),new THREE.Vector3(x,y+.45,center.z+1.8),0xffb547,g,fi,++seq);
      }
      createDevice(key,"hydrant","消火栓箱 "+(fi+1),new THREE.Vector3(minX+1,floorY(fi)+.8,minZ+1),0xff5d6c,g,fi,++seq,"box");
      createDevice(key,"manual","手动报警按钮 "+(fi+1),new THREE.Vector3(maxX-1,floorY(fi)+.85,maxZ-1),0xffb547,g,fi,++seq,"box");
    }else if(key==="security"){
      [[minX,minZ],[maxX,minZ],[minX,maxZ],[maxX,maxZ]].forEach((p,n)=>{
        createDevice(key,"camera","摄像机 "+(fi+1)+"-"+(n+1),new THREE.Vector3(p[0],y+1,p[1]),0x03affe,g,fi,++seq,"cone");
      });
      createDevice(key,"access","门禁控制器 "+(fi+1),new THREE.Vector3(center.x,y,minZ+1),0x32d583,g,fi,++seq,"box");
      createDevice(key,"intrusion","入侵探测器 "+(fi+1),new THREE.Vector3(maxX-1,y,center.z),0xffb547,g,fi,++seq);
    }else if(key==="hvac"){
      addPipe(g,new THREE.Vector3(minX,y,center.z-4),new THREE.Vector3(maxX,y,center.z-4),.34,0x63c7ff,fi,key);
      addPipe(g,new THREE.Vector3(minX,y,center.z+4),new THREE.Vector3(maxX,y,center.z+4),.29,0x32d583,fi,key);
      for(let n=0;n<4;n++){
        const x=minX+(n+1)*spanX/5;
        createDevice(key,"fcu","风机盘管 "+(fi+1)+"-"+(n+1),new THREE.Vector3(x,y-.35,center.z-4),0x63c7ff,g,fi,++seq,"box");
      }
      createDevice(key,"thermostat","温控器 "+(fi+1),new THREE.Vector3(center.x,y,maxZ-1),0x32d583,g,fi,++seq,"box");
    }else if(key==="power"){
      addPipe(g,new THREE.Vector3(minX,y,center.z-2),new THREE.Vector3(maxX,y,center.z-2),.1,0xffb547,fi,key);
      for(let n=0;n<3;n++){
        const x=minX+(n+1)*spanX/4;
        createDevice(key,"panel","智能配电箱 "+(fi+1)+"-"+(n+1),new THREE.Vector3(x,floorY(fi)+.7,minZ+1),0xffb547,g,fi,++seq,"box");
      }
      createDevice(key,"meter","智能电表 "+(fi+1),new THREE.Vector3(maxX-1,floorY(fi)+.8,center.z),0x32d583,g,fi,++seq,"box");
    }
  });
  return g;
}
function hideAllSystems(){Object.values(systemGroups).forEach(g=>g.visible=false)}
function applySystemScope(){
  const g=systemGroups[currentSystem];if(!g)return;
  g.traverse(o=>{
    const fi=o.userData?.systemDevice?.floorIndex??o.userData?.systemLine?.floorIndex;
    if(fi===undefined)return;
    o.visible=currentScope==="building"||activeFloorIndex===null||fi===activeFloorIndex;
  });
  $$(".scope-switch button").forEach(b=>b.classList.toggle("active",b.dataset.scope===currentScope));
  const floorBtn=$('.scope-switch button[data-scope="floor"]');if(floorBtn)floorBtn.disabled=activeFloorIndex===null;
}
function renderSystemPanel(){
  const cfg=SYSTEM_CONFIG[currentSystem],devices=systemDevices(currentSystem);
  const alarms=devices.filter(d=>d.status==="alarm").length;
  const ok=devices.filter(d=>d.status!=="offline").length;
  const scopeName=currentScope==="floor"&&activeFloorIndex!==null?floorDefs[activeFloorIndex].name:"全楼";
  $("#systemSummary").innerHTML='<div class="sys-title"><b>'+cfg.name+' · '+scopeName+'</b><span style="color:'+(alarms?'#ff6573':'#32d583')+'">● '+(alarms?alarms+" 个活动告警":cfg.ok)+'</span></div>'+
    '<div class="sys-kpis"><div><small>设备数量</small><b>'+devices.length+'</b></div><div><small>在线设备</small><b>'+ok+'</b></div><div><small>活动告警</small><b>'+alarms+'</b></div><div><small>当前范围</small><b style="font-size:10px">'+scopeName+'</b></div></div>';
  $("#systemLegend").innerHTML=cfg.legend.map(x=>'<p><i style="background:'+x[0]+'"></i><span>'+x[1]+'</span><b>显示</b></p>').join("");
  $("#systemDeviceList").innerHTML=devices.length?devices.slice(0,16).map(d=>
    '<button class="system-device-item '+(d.status==="alarm"?"alarm":"")+'" data-device="'+d.id+'"><i style="color:'+(d.status==="alarm"?"#ff5d6c":"#32d583")+';background:currentColor"></i><span><b>'+d.label+'</b><small>'+d.floor+' · '+d.room+'</small></span><em>'+(d.status==="alarm"?"告警":"在线")+'</em></button>'
  ).join(""):'<div class="empty">当前范围暂无设备</div>';
  $$(".system-device-item").forEach(btn=>btn.addEventListener("click",()=>{
    const d=deviceRegistry.find(x=>x.id===btn.dataset.device);if(d){openDevice(d);locateDevice3D(false)}
  }));
}
function setScope(scope){
  if(scope==="floor"&&activeFloorIndex===null){showToast("请先在“楼层”中进入一个楼层");return}
  currentScope=scope;applySystemScope();renderSystemPanel();closeDevice(false);updateTwinNavigation();
  if(scope==="floor"&&activeFloorIndex!==null){
    const f=floorDefs[activeFloorIndex],box=new THREE.Box3();f.meshes.forEach(m=>box.expandByObject(m));flyCameraToBox(box,1.7,new THREE.Vector3(1,.45,1));
  }else homeBimView();
}
function setSystemMode(key){
  currentSystem=key;currentBimTab="systems";ensureSystemLayer(key);
  closeDevice(false);
  bimMeshes.forEach(m=>setMeshVisual(m,.085));
  hideAllSystems();systemGroups[key].visible=true;applySystemScope();
  $$(".system-tabs button").forEach(b=>b.classList.toggle("active",b.dataset.system===key));
  renderSystemPanel();updateTwinNavigation();
  $("#themeName").textContent=SYSTEM_CONFIG[key].short+"透视";
}
function restoreDeviceVisual(){
  if(!selectedDevice)return;
  const m=selectedDevice.mesh;if(m){
    m.scale.copy(selectedDeviceOriginalScale||new THREE.Vector3(1,1,1));
    const color=selectedDevice.status==="alarm"?0xff3448:selectedDevice.normalColor;
    if(m.material?.color)m.material.color.setHex(color);
    if(m.material?.emissive){m.material.emissive.setHex(color);m.material.emissiveIntensity=selectedDevice.status==="alarm"?1:.65}
  }
}
function renderDeviceDrawer(){
  const d=selectedDevice;if(!d)return;
  const cfg=SYSTEM_CONFIG[d.system],isAlarm=d.status==="alarm",isAck=d.status==="ack";
  $("#deviceSystem").textContent=cfg.name;
  $("#deviceName").textContent=d.label;
  $("#deviceCode").textContent=d.code;
  $("#deviceStatus").className="device-status "+(isAlarm?"alarm":isAck?"warn":"ok");
  $("#deviceStatus").textContent=isAlarm?"● 活动告警":isAck?"● 已确认":"● 在线";
  $("#deviceLocation").textContent=(selected?.userData?.building?.name||"楼宇")+" / "+d.floor+" / "+d.room;
  const telemetry=d.telemetry.map((x,i)=>{
    let val=x[1];if(isAlarm&&d.type==="smoke"&&i===0)val="1.86";
    return '<div><small>'+x[0]+'</small><b>'+val+'</b><em>'+x[2]+'</em></div>';
  }).join("");
  $("#deviceTelemetry").innerHTML=telemetry;
  $("#deviceTrend").innerHTML=d.trend.map((v,i)=>'<i style="height:'+Math.min(100,(isAlarm&&i>10?v+35:v))+'%"></i>').join("");
  const events=(isAlarm?[{time:"刚刚",text:"设备触发告警 · 待处置",alarm:true}]:[]).concat(d.events).slice(0,4);
  $("#deviceEvents").innerHTML=events.map(e=>'<p class="'+(e.alarm?"alarm":"")+'"><b>'+e.time+'</b>　'+e.text+'</p>').join("");
  $("#ackDevice").disabled=!isAlarm;
}
function openDevice(d){
  if(selectedDevice&&selectedDevice!==d)restoreDeviceVisual();
  selectedDevice=d;selectedDeviceOriginalScale=d.mesh.scale.clone();
  d.mesh.scale.multiplyScalar(1.65);
  const color=d.status==="alarm"?0xff3448:0x9cecff;
  if(d.mesh.material?.color)d.mesh.material.color.setHex(color);
  if(d.mesh.material?.emissive){d.mesh.material.emissive.setHex(color);d.mesh.material.emissiveIntensity=1.25}
  $("#deviceDrawer").classList.add("show");$(".viewer-shell").classList.add("device-open");$("#bimPanel").classList.add("device-covered");
  renderDeviceDrawer();renderSystemPanel();updateTwinNavigation();
  $("#themeName").textContent=SYSTEM_CONFIG[d.system].short+" · 单设备";
  $$(".system-device-item").forEach(b=>b.classList.toggle("active",b.dataset.device===d.id));
}
function closeDevice(updateNav=true){
  if(selectedDevice)restoreDeviceVisual();
  selectedDevice=null;selectedDeviceOriginalScale=null;
  $("#deviceDrawer")?.classList.remove("show");$(".viewer-shell")?.classList.remove("device-open");$("#bimPanel")?.classList.remove("device-covered");
  $$(".system-device-item").forEach(b=>b.classList.remove("active"));
  if(updateNav)updateTwinNavigation();
}
function locateDevice3D(show=true){
  if(!selectedDevice)return;
  const box=new THREE.Box3().setFromObject(selectedDevice.mesh);
  box.expandByScalar(2.5);flyCameraToBox(box,3.4,new THREE.Vector3(1,.45,1));
  if(show)showToast("已定位 "+selectedDevice.label);
}
function simulateAlarm(){
  ensureSystemLayer(currentSystem);
  const candidates=systemDevices(currentSystem);
  if(!candidates.length){showToast("当前范围没有可演练设备");return}
  const preferred=candidates.find(d=>d.type==="smoke")||candidates.find(d=>d.type==="camera")||candidates[0];
  preferred.status="alarm";preferred.events.unshift({time:"刚刚",text:"数字孪生告警演练触发",alarm:true});
  if(preferred.mesh.material?.color)preferred.mesh.material.color.setHex(0xff3448);
  if(preferred.mesh.material?.emissive){preferred.mesh.material.emissive.setHex(0xff3448);preferred.mesh.material.emissiveIntensity=1.2}
  renderSystemPanel();openDevice(preferred);locateDevice3D(false);showToast(preferred.label+" 已触发模拟告警","alarm");
}
function clearAlarm(){
  deviceRegistry.filter(d=>d.system===currentSystem).forEach(d=>{
    d.status="online";
    if(d.mesh.material?.color)d.mesh.material.color.setHex(d.normalColor);
    if(d.mesh.material?.emissive){d.mesh.material.emissive.setHex(d.normalColor);d.mesh.material.emissiveIntensity=.65}
  });
  if(selectedDevice)renderDeviceDrawer();renderSystemPanel();showToast(SYSTEM_CONFIG[currentSystem].name+" 演练状态已清除");
}
function acknowledgeDevice(){
  if(!selectedDevice||selectedDevice.status!=="alarm")return;
  selectedDevice.status="ack";selectedDevice.events.unshift({time:"刚刚",text:"告警已由值班员确认"});
  renderDeviceDrawer();renderSystemPanel();showToast("已确认 "+selectedDevice.label+" 告警");
}
function createDeviceWorkOrder(){
  if(!selectedDevice)return;
  const no="WO-"+new Date().toISOString().slice(5,10).replace("-","")+String(Math.floor(100+Math.random()*899));
  selectedDevice.workOrder=no;selectedDevice.events.unshift({time:"刚刚",text:"已生成运维工单 "+no});
  renderDeviceDrawer();showToast("已生成工单 "+no);
}

/* -------- BIM info / load -------- */
function showBimElementInfo(obj){
  if(!obj)return;
  if(obj.userData.systemDevice){openDevice(obj.userData.systemDevice);return}
  const mesh=obj.isMesh?obj:null;if(!mesh)return;
  highlightBimElement(mesh);
  const guid=mesh.userData.ifcGuid||"-",meta=mesh.userData.ifcMeta||{},floor=floorDefs.find(f=>f.id===mesh.userData.floorId);
  const tri=mesh.geometry?.index?Math.floor(mesh.geometry.index.count/3):Math.floor((mesh.geometry?.attributes?.position?.count||0)/3);
  $("#elementInfo").innerHTML='<h5>'+(meta.name||mesh.name||"BIM构件")+'</h5><dl>'+
    '<dt>IFC类型</dt><dd>'+(meta.type||"Mesh")+'</dd><dt>所属楼层</dt><dd>'+(floor?.name||"未归类")+'</dd>'+
    '<dt>GUID</dt><dd>'+guid+'</dd><dt>三角面</dt><dd>'+tri.toLocaleString()+'</dd></dl>';
}
async function ensureBimModel(){
  if(bimLoaded)return true;
  if(bimLoadingPromise)return bimLoadingPromise;
  bimLoadingPromise=(async()=>{
    const totalStart=performance.now();showDetailLoading(true);updateDetailLoading("准备楼宇 BIM...");
    try{
      const metaPromise=fetch(BIM_META_URL,{cache:"force-cache"}).then(r=>{if(!r.ok)throw new Error("BIM metadata HTTP "+r.status);return r.json()});
      if(prefetchPromise)await Promise.race([prefetchPromise,new Promise(r=>setTimeout(r,800))]);
      const [meta,gltf]=await Promise.all([metaPromise,loadBimGeometry()]);
      updateDetailLoading("建立 IFC 元数据索引...");await nextFrame();
      bimMeta=meta;buildMetaIndex(meta);
      bimRoot=gltf.scene;bimRoot.name="Schependomlaan-BIM";
      updateDetailLoading("归一化楼宇坐标...");await nextFrame();
      bimBounds=normalizeBimModel(bimRoot);bimLayer.add(bimRoot);
      updateDetailLoading("建立楼层与构件索引...");await nextFrame();
      assignMeshesToFloors();bimBounds=new THREE.Box3().setFromObject(bimRoot);
      renderFloorList();
      $("#bimElementCount").textContent=bimMeshes.length.toLocaleString();
      $("#bimFloorCount").textContent=floorDefs.length;
      $("#bimParseTime").textContent=(bimParseMs/1000).toFixed(1)+"s";
      bimLoaded=true;
      const totalMs=performance.now()-totalStart;
      updatePerfChip("BIM Ready · "+bimMeshes.length.toLocaleString()+"构件 · "+(totalMs/1000).toFixed(1)+"s");
      updateDetailLoading("BIM模型已就绪 · "+(totalMs/1000).toFixed(1)+"s");
      setTimeout(()=>showDetailLoading(false),180);
      return true;
    }catch(err){
      console.error("BIM load failed",err);updateDetailLoading("BIM精细模型加载失败："+err.message,true);bimLoadingPromise=null;return false;
    }
  })();
  return bimLoadingPromise;
}

/* -------- camera / hierarchy -------- */
function flyCamera(startPos,startTarget,endPos,endTarget,duration=700){
  const t0=performance.now();controls.autoRotate=false;$("#autoRotate").classList.remove("active");
  function step(now){
    const t=Math.min(1,(now-t0)/duration),e=1-Math.pow(1-t,3);
    camera.position.lerpVectors(startPos,endPos,e);controls.target.lerpVectors(startTarget,endTarget,e);controls.update();
    if(t<1)requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function flyCameraToBox(box,pad=1.8,dir=new THREE.Vector3(1,.75,1)){
  if(!box||box.isEmpty())return;
  const center=new THREE.Vector3(),size=new THREE.Vector3();box.getCenter(center);box.getSize(size);
  const radius=Math.max(size.x,size.y,size.z)*pad,endPos=center.clone().add(dir.clone().normalize().multiplyScalar(radius));
  flyCamera(camera.position.clone(),controls.target.clone(),endPos,center,720);
}
function homeBimView(){if(bimBounds)flyCameraToBox(bimBounds,1.55,new THREE.Vector3(1,.64,1))}
function homeCampusView(){flyCamera(camera.position.clone(),controls.target.clone(),new THREE.Vector3(92,74,100),new THREE.Vector3(0,7,0),700)}
function homeView(){viewMode==="bim"?homeBimView():homeCampusView()}

function updateTwinNavigation(){
  const bc=$("#twinBreadcrumb");if(!bc)return;
  if(viewMode!=="bim"){bc.innerHTML="";return}
  const items=[{level:"campus",label:"园区"},{level:"building",label:selected?.userData?.building?.name||"楼宇"}];
  const fi=activeFloorIndex!==null?activeFloorIndex:(currentBimTab==="floors"?selectedFloorIndex:null);
  if(fi!==null&&floorDefs[fi])items.push({level:"floor",label:floorDefs[fi].name});
  if(currentBimTab==="systems")items.push({level:"system",label:SYSTEM_CONFIG[currentSystem].short});
  if(selectedDevice)items.push({level:"device",label:selectedDevice.label});
  bc.innerHTML=items.map((x,i)=>(i?'<i>›</i>':'')+'<button data-level="'+x.level+'" class="'+(i===items.length-1?"active":"")+'">'+x.label+'</button>').join("");
  $$("#twinBreadcrumb button").forEach(b=>b.addEventListener("click",()=>{
    const level=b.dataset.level;
    if(level==="campus")backToCampus();
    else if(level==="building"){closeDevice(false);setBimTab("overview");homeBimView()}
    else if(level==="floor"&&fi!==null){closeDevice(false);setBimTab("floors");selectFloor(fi)}
    else if(level==="system"){closeDevice(false);setBimTab("systems")}
  }));
  let parts=[selected?.userData?.building?.name||"楼宇"];
  if(activeFloorIndex!==null)parts.push(floorDefs[activeFloorIndex].name);
  if(currentBimTab==="systems")parts.push(SYSTEM_CONFIG[currentSystem].short);
  if(selectedDevice)parts.push(selectedDevice.label);
  $("#sceneCrumb").textContent=parts.join(" / ");
}
async function enterBimMode(){
  if(!selected)return;
  setRenderProfile("bim");
  const ok=await ensureBimModel();if(!ok){setRenderProfile("campus");return}
  viewMode="bim";world.visible=false;if(selectedHelper)selectedHelper.visible=false;bimLayer.visible=true;
  $("#buildingCard").classList.remove("show");$("#bimPanel").classList.add("show");$(".viewer-shell").classList.add("bim-active");
  $("#tabs").style.display="none";$("#themeName").textContent="楼宇 BIM";
  $("#bimBuildingName").textContent=selected.userData.building.name+" · BIM精细模型";
  $("#bimModeText").textContent="LOD4 / "+bimMeshes.length.toLocaleString()+" 构件 / Binary GLB";
  $("#assetBadge").textContent="LOD4 BIM · Schependomlaan CC BY 4.0";
  resetFloorTargets(true);hideAllSystems();currentScope="building";setBimTab("overview");updateTwinNavigation();homeBimView();
}
function backToCampus(){
  if(viewMode!=="bim")return;
  closeDevice(false);resetBimElementHighlight();resetFloorTargets(true);hideAllSystems();
  viewMode="campus";bimLayer.visible=false;world.visible=true;if(selectedHelper)selectedHelper.visible=true;
  $("#bimPanel").classList.remove("show");$(".viewer-shell").classList.remove("bim-active");$("#tabs").style.display="grid";
  $("#sceneCrumb").textContent="园区空间态势";const active=$("#tabs button.active");$("#themeName").textContent=themeNames[active?.dataset.theme||"general"];
  $("#assetBadge").textContent="Campus LOD · Quaternius CC0";updateTwinNavigation();setRenderProfile("campus");homeCampusView();
}
function setBimTab(tab){
  currentBimTab=tab;closeDevice(false);
  $$(".bim-tabs button").forEach(b=>b.classList.toggle("active",b.dataset.bimtab===tab));
  $$(".bim-pane").forEach(p=>p.classList.toggle("active",p.dataset.bimpane===tab));
  if(tab==="overview"){
    activeFloorIndex=null;currentScope="building";resetFloorTargets(true);hideAllSystems();$("#themeName").textContent="楼宇 BIM";homeBimView();
  }else if(tab==="floors"){
    hideAllSystems();$("#themeName").textContent="楼层抽屉";
    if(selectedFloorIndex===null&&!floorsExploded)resetFloorTargets(false);
  }else if(tab==="systems"){
    if(activeFloorIndex!==null)currentScope="floor";else currentScope="building";
    setSystemMode(currentSystem);
  }
  updateTwinNavigation();
}

/* -------- picking -------- */
const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
let selected=null,selectedHelper=null;
function setHighlight(obj,on){
  obj.traverse(o=>{
    if(!o.isMesh)return;
    const mats=Array.isArray(o.material)?o.material:[o.material];
    mats.filter(Boolean).forEach(mat=>{
      if(!mat.emissive)return;
      if(on){mat.emissive.setHex(0x087da1);mat.emissiveIntensity=.75}
      else{mat.emissive.copy(o.userData.baseEmissive||new THREE.Color());mat.emissiveIntensity=o.userData.baseEI||0}
    });
  });
}
function selectBuilding(obj){
  if(selected===obj){$("#buildingCard").classList.add("show");return}
  if(selected){setHighlight(selected,false);selected.userData.labelEl?.classList.remove("selected")}
  if(selectedHelper){scene.remove(selectedHelper);selectedHelper.geometry.dispose();selectedHelper.material.dispose()}
  selected=obj;setHighlight(obj,true);obj.userData.labelEl?.classList.add("selected");
  selectedHelper=new THREE.Box3Helper(new THREE.Box3().setFromObject(obj),0x42e6ff);scene.add(selectedHelper);
  const d=obj.userData.building,s=d.stats;
  $("#bcName").textContent=d.name;$("#bcType").textContent=d.type;$("#bcDevices").textContent=s[0];$("#bcPeople").textContent=s[1];$("#bcEnergy").textContent=s[2];$("#bcAlarm").textContent=s[3];
  $("#buildingCard").classList.add("show");
}
function setPointer(clientX,clientY){
  const rect=renderer.domElement.getBoundingClientRect();
  pointer.x=((clientX-rect.left)/rect.width)*2-1;pointer.y=-((clientY-rect.top)/rect.height)*2+1;raycaster.setFromCamera(pointer,camera);
}
function pickCampus(clientX,clientY){
  setPointer(clientX,clientY);const hits=raycaster.intersectObjects(buildingGroup.children,true);
  if(!hits.length)return null;
  let root=hits[0].object.userData.buildingRoot;
  if(!root){let p=hits[0].object;while(p&&p.parent!==buildingGroup)p=p.parent;root=p}
  if(root?.userData?.building)selectBuilding(root);return root;
}
function pickBim(clientX,clientY){
  setPointer(clientX,clientY);
  if(currentBimTab==="systems"){
    const visible=systemPickables.filter(m=>m.parent&&m.parent.visible!==false&&m.visible!==false);
    const hits=raycaster.intersectObjects(visible,true);
    if(hits.length){
      let p=hits[0].object;while(p&&!p.userData.systemDevice&&p.parent)p=p.parent;
      if(p?.userData?.systemDevice){openDevice(p.userData.systemDevice);return p}
    }
    return null;
  }
  const hits=raycaster.intersectObjects(bimPickables,true);
  if(hits.length){showBimElementInfo(hits[0].object);return hits[0].object}
  return null;
}
function pickAt(x,y){return viewMode==="bim"?pickBim(x,y):pickCampus(x,y)}
let down=null;
renderer.domElement.addEventListener("pointerdown",e=>{down=[e.clientX,e.clientY]});
renderer.domElement.addEventListener("pointerup",e=>{if(!down)return;const d=Math.hypot(e.clientX-down[0],e.clientY-down[1]);if(d<5)pickAt(e.clientX,e.clientY);down=null});
renderer.domElement.addEventListener("dblclick",e=>{
  if(viewMode==="campus"){const p=pickCampus(e.clientX,e.clientY);if(p)focusOn(p)}
  else if(currentBimTab!=="systems"){const p=pickBim(e.clientX,e.clientY);if(p?.isMesh)flyCameraToBox(new THREE.Box3().setFromObject(p).expandByScalar(1),4,new THREE.Vector3(1,.5,1))}
});
function focusOn(obj){
  const box=new THREE.Box3().setFromObject(obj),center=new THREE.Vector3(),size=new THREE.Vector3();box.getCenter(center);box.getSize(size);
  const radius=Math.max(size.x,size.y,size.z),endPos=center.clone().add(new THREE.Vector3(1,.72,1).normalize().multiplyScalar(radius*2.35+12));
  flyCamera(camera.position.clone(),controls.target.clone(),endPos,center.clone().add(new THREE.Vector3(0,size.y*.15,0)),780);
}

/* -------- UI events -------- */
$("#closeCard").addEventListener("click",()=>$("#buildingCard").classList.remove("show"));
$("#focusBuilding").addEventListener("click",()=>selected&&focusOn(selected));
$("#enterBim").addEventListener("click",enterBimMode);
$("#backCampus").addEventListener("click",backToCampus);
$$(".bim-tabs button").forEach(b=>b.addEventListener("click",()=>setBimTab(b.dataset.bimtab)));
$("#resetFloors").addEventListener("click",()=>{resetFloorTargets(true);updateTwinNavigation();homeBimView()});
$("#explodeFloors").addEventListener("click",explodeAllFloors);
$$(".system-tabs button").forEach(b=>b.addEventListener("click",()=>setSystemMode(b.dataset.system)));
$$(".scope-switch button").forEach(b=>b.addEventListener("click",()=>setScope(b.dataset.scope)));
$("#simulateAlarm").addEventListener("click",simulateAlarm);
$("#clearAlarm").addEventListener("click",clearAlarm);
$("#closeDevice").addEventListener("click",()=>closeDevice());
$("#locateDevice").addEventListener("click",()=>locateDevice3D(true));
$("#ackDevice").addEventListener("click",acknowledgeDevice);
$("#createWorkOrder").addEventListener("click",createDeviceWorkOrder);
$("#homeView").addEventListener("click",homeView);
$("#zoomIn").addEventListener("click",()=>{camera.position.lerp(controls.target,.12)});
$("#zoomOut").addEventListener("click",()=>{const d=camera.position.clone().sub(controls.target).multiplyScalar(1.14);camera.position.copy(controls.target).add(d)});
$("#autoRotate").addEventListener("click",e=>{controls.autoRotate=!controls.autoRotate;e.currentTarget.classList.toggle("active",controls.autoRotate)});

const themeNames={general:"综合态势",security:"安防消防",energy:"能耗环境",facility:"设备设施"};
$$("#tabs button").forEach(btn=>btn.addEventListener("click",()=>{
  if(viewMode!=="campus")return;
  $$("#tabs button").forEach(b=>b.classList.remove("active"));btn.classList.add("active");
  const theme=btn.dataset.theme;$("#themeName").textContent=themeNames[theme];
  Object.entries(markerGroups).forEach(([k,g])=>{g.visible=theme==="general"||k===theme});
}));

function resize(){
  const r=viewer.getBoundingClientRect();renderer.setSize(r.width,r.height,false);composer.setSize(r.width,r.height);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(viewer);resize();

const tmp=new THREE.Vector3();
function updateLabels(){
  if(viewMode!=="campus")return;
  const rect=viewer.getBoundingClientRect();
  buildings.forEach(b=>{
    const box=new THREE.Box3().setFromObject(b);box.getCenter(tmp);tmp.y=box.max.y+2.5;tmp.project(camera);
    const el=b.userData.labelEl;if(!el)return;
    const behind=tmp.z>1;el.style.opacity=behind?"0":"1";el.style.left=((tmp.x*.5+.5)*rect.width)+"px";el.style.top=((-tmp.y*.5+.5)*rect.height)+"px";
  });
}
const clock=new THREE.Clock();
function animate(){
  requestAnimationFrame(animate);
  const t=clock.getElapsedTime();controls.update();

  if(viewMode==="campus"){
    markers.forEach(m=>{
      const r=m.userData.ring,s=1+(Math.sin(t*2.5+m.userData.pulseOffset)+1)*.23;
      r.scale.setScalar(s);r.material.opacity=.25+(Math.sin(t*2.5+m.userData.pulseOffset)+1)*.18;
    });
    pool.material.emissiveIntensity=.24+(Math.sin(t*1.4)+1)*.07;
    if(selectedHelper&&selected)selectedHelper.box.setFromObject(selected);
  }

  if(bimLoaded&&viewMode==="bim"){
    bimMeshes.forEach(m=>{
      const base=m.userData.__basePosition;if(!base)return;
      const tx=base.x+(m.userData.__targetOffsetX||0),ty=base.y+(m.userData.__targetOffsetY||0);
      m.position.x+=(tx-m.position.x)*.16;m.position.y+=(ty-m.position.y)*.16;
    });
    if(currentBimTab==="systems"&&systemGroups[currentSystem]?.visible){
      systemDevices(currentSystem).forEach((d,i)=>{
        if(!d.mesh.visible)return;
        const ring=d.mesh.children.find(x=>x.userData.deviceRing);
        if(ring){
          const pulse=(Math.sin(t*3+d.mesh.userData.devicePulse)+1)/2;
          ring.scale.setScalar(1+pulse*.35);
          ring.material.opacity=d.status==="alarm"?.75:(.22+pulse*.28);
          if(d.status==="alarm")ring.material.color.setHex(0xff3448);
          else ring.material.color.setHex(d.normalColor);
        }
      });
    }
  }

  updateLabels();
  if(viewMode==="bim")renderer.render(scene,camera);
  else composer.render();
}
animate();
$("#modelState").textContent="本地 GLB 模型：已就绪";
$("#loading").classList.add("done");
setTimeout(()=>$("#loading").remove(),700);

document.addEventListener("keydown",e=>{
  if(e.key==="Escape"){
    modal.classList.remove("show");
    if(selectedDevice){closeDevice();return}
    if(viewMode==="bim")backToCampus();
    else $("#buildingCard").classList.remove("show");
  }
});

const debugParams=new URLSearchParams(location.search);
if(debugParams.get("bim")==="1"){
  setTimeout(async()=>{
    selectBuilding(buildings[0]);
    await enterBimMode();
    const floor=Number(debugParams.get("floor"));
    if(Number.isInteger(floor)&&floor>=0&&floor<floorDefs.length){
      setBimTab("floors");selectFloor(floor);enterSelectedFloor();
    }
    const sys=debugParams.get("system");
    if(sys&&SYSTEM_CONFIG[sys]){setBimTab("systems");setSystemMode(sys)}
  },220);
}
