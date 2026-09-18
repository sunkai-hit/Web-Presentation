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
  throw new Error("IBMS v0.6.0 requires a local HTTP server. Run start-local.bat.");
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
   v0.6.0 Digital Twin: xeokit XKT BIM
   Campus LOD → Building BIM → Floor → System → Device
   ========================= */
let viewMode="campus";
let currentBimTab="overview";
let bimLoaded=false;
let bimLoadingPromise=null;
let bimEngine=null;
let bimModulePromise=null;
let floorDefs=[];
let selectedFloorIndex=null;
let activeFloorIndex=null;
let currentSystem="fire";
let currentScope="building";
let selectedDevice=null;
let toastTimer=null;

const XKT_SRC="./assets/bim/Schependomlaan.ifc.xkt";
const SYSTEM_CONFIG={
  fire:{name:"消防系统",short:"消防",ok:"系统正常",legend:[["#ff5d6c","消防给水/喷淋"],["#ffb547","火灾自动报警"],["#03affe","水压/液位监测"]]},
  security:{name:"安防系统",short:"安防",ok:"在线率 98%",legend:[["#03affe","视频监控"],["#32d583","门禁控制"],["#ffb547","入侵探测"]]},
  hvac:{name:"暖通系统",short:"暖通",ok:"运行正常",legend:[["#63c7ff","送风系统"],["#32d583","回风/新风"],["#91afc6","末端设备"]]},
  power:{name:"电气系统",short:"电气",ok:"负载正常",legend:[["#ffb547","动力配电"],["#03affe","弱电/控制"],["#32d583","计量监测"]]}
};

function showToast(text,type=""){
  const el=$("#twinToast");if(!el)return;
  el.textContent=text;el.className="twin-toast show"+(type?" "+type:"");
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.className="twin-toast",2400);
}
function updateDetailLoading(text,error=false){
  $("#detailLoadingText").textContent=text;
  $("#detailLoading").classList.toggle("error",error);
}
function showDetailLoading(show=true){$("#detailLoading").classList.toggle("show",show)}
function updatePerfChip(text){const el=$("#perfChip");if(el)el.textContent=text}

function warmBimRuntime(){
  if(!bimModulePromise)bimModulePromise=import("./bim-xkt.js");
  fetch(XKT_SRC,{cache:"force-cache"}).catch(()=>{});
}
if(!directBimSmoke){
  if("requestIdleCallback" in window)requestIdleCallback(()=>warmBimRuntime(),{timeout:3500});
  else setTimeout(warmBimRuntime,2200);
}

function showBimObjectInfo(info){
  if(!info)return;
  $("#elementInfo").innerHTML='<h5>'+info.name+'</h5><dl>'+
    '<dt>IFC类型</dt><dd>'+info.type+'</dd>'+
    '<dt>所属楼层</dt><dd>'+info.floor+'</dd>'+
    '<dt>GUID</dt><dd>'+info.id+'</dd>'+
    '<dt>对象层级</dt><dd>楼宇 BIM 构件</dd></dl>';
}
async function ensureBimModel(){
  if(bimLoaded)return true;
  if(bimLoadingPromise)return bimLoadingPromise;
  bimLoadingPromise=(async()=>{
    const started=performance.now();
    showDetailLoading(true);updateDetailLoading("加载 xeokit BIM 引擎...");
    try{
      const mod=await (bimModulePromise||(bimModulePromise=import("./bim-xkt.js")));
      updateDetailLoading("读取 XKT BIM · 约 1.6MB...");
      bimEngine=await mod.createBimTwin({
        canvasId:"xeokitCanvas",
        src:XKT_SRC,
        onProgress:(msg)=>updateDetailLoading(msg),
        onObjectPick:(info)=>showBimObjectInfo(info),
        onDevicePick:(device)=>openDevice(device)
      });
      floorDefs=bimEngine.floors;
      $("#bimElementCount").textContent=Number(bimEngine.objectCount||0).toLocaleString();
      $("#bimFloorCount").textContent=floorDefs.length;
      $("#bimParseTime").textContent=(bimEngine.loadMs/1000).toFixed(2)+"s";
      renderFloorList();
      bimLoaded=true;
      const total=performance.now()-started;
      updatePerfChip("XKT BIM Ready · "+Number(bimEngine.objectCount||0).toLocaleString()+"构件 · "+(total/1000).toFixed(2)+"s");
      updateDetailLoading("XKT BIM 已就绪 · "+(total/1000).toFixed(2)+"s");
      setTimeout(()=>showDetailLoading(false),180);
      return true;
    }catch(err){
      console.error("XKT BIM load failed",err);
      updateDetailLoading("XKT BIM 加载失败："+err.message,true);
      bimLoadingPromise=null;return false;
    }
  })();
  return bimLoadingPromise;
}

function floorStats(index){
  const seeds=[
    {people:0,energy:420,alarm:0},{people:86,energy:960,alarm:1},{people:72,energy:880,alarm:0},
    {people:64,energy:810,alarm:0},{people:38,energy:620,alarm:0},{people:3,energy:260,alarm:0}
  ];
  const s=seeds[index%seeds.length];
  return {people:s.people,energy:s.energy,alarm:s.alarm,devices:72+index*9};
}
function renderFloorList(){
  $("#floorList").innerHTML=floorDefs.map((f,i)=>{
    const st=floorStats(i);
    return '<button class="floor-item" data-floor="'+i+'"><span><b>'+f.name+'</b><small>构件 '+f.objectIds.length+' · 设备 '+st.devices+'</small></span><em>抽屉查看 ›</em></button>';
  }).join("");
  $$(".floor-item").forEach(btn=>btn.addEventListener("click",()=>selectFloor(Number(btn.dataset.floor))));
}
function renderFloorScopeCard(index){
  const box=$("#floorScopeCard");if(!box)return;
  if(index===null||!floorDefs[index]){box.innerHTML='<div class="empty">请选择一个楼层</div>';return}
  const f=floorDefs[index],st=floorStats(index);
  box.innerHTML='<div class="floor-scope-inner"><header><div><b>'+f.name+'</b><small>'+f.objectIds.length+' BIM构件</small></div><em>● 正常</em></header>'+
    '<div class="floor-scope-kpis"><div><small>设备</small><b>'+st.devices+'</b></div><div><small>人员</small><b>'+st.people+'</b></div><div><small>告警</small><b>'+st.alarm+'</b></div></div>'+
    '<button id="enterFloorScope">进入该楼层 · 查看专业系统</button></div>';
  $("#enterFloorScope").addEventListener("click",enterSelectedFloor);
}
function resetFloors(clearActive=true){
  selectedFloorIndex=null;if(clearActive)activeFloorIndex=null;
  $$(".floor-item").forEach(b=>b.classList.remove("active"));renderFloorScopeCard(null);
  bimEngine?.resetBimEmphasis();bimEngine?.hideSystems();
}
function selectFloor(index){
  if(!bimEngine||!floorDefs[index])return;
  closeDevice(false);selectedFloorIndex=index;
  $$(".floor-item").forEach((b,i)=>b.classList.toggle("active",i===index));
  bimEngine.setFloorDrawer(index);
  renderFloorScopeCard(index);updateTwinNavigation();
}
function enterSelectedFloor(){
  if(selectedFloorIndex===null)return;
  activeFloorIndex=selectedFloorIndex;currentScope="floor";
  showToast("已进入 "+floorDefs[activeFloorIndex].name+"，专业系统限定到当前楼层");
  setBimTab("systems");
}
function explodeAllFloors(){
  if(!bimEngine)return;
  closeDevice(false);activeFloorIndex=null;selectedFloorIndex=null;currentScope="building";
  $$(".floor-item").forEach(b=>b.classList.remove("active"));renderFloorScopeCard(null);
  bimEngine.explodeFloors();updateTwinNavigation();
}

function currentDevices(){
  if(!bimEngine)return[];
  return bimEngine.getDevices(currentSystem,currentScope,activeFloorIndex);
}
function renderSystemPanel(){
  const cfg=SYSTEM_CONFIG[currentSystem],devices=currentDevices(),alarms=devices.filter(d=>d.status==="alarm").length;
  const scopeName=currentScope==="floor"&&activeFloorIndex!==null?floorDefs[activeFloorIndex].name:"全楼";
  $("#systemSummary").innerHTML='<div class="sys-title"><b>'+cfg.name+' · '+scopeName+'</b><span style="color:'+(alarms?'#ff6573':'#32d583')+'">● '+(alarms?alarms+" 个活动告警":cfg.ok)+'</span></div>'+
    '<div class="sys-kpis"><div><small>设备数量</small><b>'+devices.length+'</b></div><div><small>在线设备</small><b>'+devices.length+'</b></div><div><small>活动告警</small><b>'+alarms+'</b></div><div><small>当前范围</small><b style="font-size:10px">'+scopeName+'</b></div></div>';
  $("#systemLegend").innerHTML=cfg.legend.map(x=>'<p><i style="background:'+x[0]+'"></i><span>'+x[1]+'</span><b>显示</b></p>').join("");
  $("#systemDeviceList").innerHTML=devices.length?devices.slice(0,18).map(d=>
    '<button class="system-device-item '+(d.status==="alarm"?"alarm":"")+'" data-device="'+d.id+'"><i style="color:'+(d.status==="alarm"?"#ff5d6c":"#32d583")+';background:currentColor"></i><span><b>'+d.label+'</b><small>'+d.floor+' · '+d.room+'</small></span><em>'+(d.status==="alarm"?"告警":"在线")+'</em></button>'
  ).join(""):'<div class="empty">当前范围暂无设备</div>';
  $$(".system-device-item").forEach(btn=>btn.addEventListener("click",()=>{
    const d=devices.find(x=>x.id===btn.dataset.device);if(d){openDevice(d);bimEngine.selectDevice(d.id)}
  }));
}
function setScope(scope){
  if(scope==="floor"&&activeFloorIndex===null){showToast("请先在“楼层”中进入一个楼层");return}
  currentScope=scope;closeDevice(false);
  bimEngine.setSystem(currentSystem,currentScope,activeFloorIndex);
  $$(".scope-switch button").forEach(b=>b.classList.toggle("active",b.dataset.scope===currentScope));
  renderSystemPanel();updateTwinNavigation();
}
function setSystemMode(key){
  if(!bimEngine)return;
  currentSystem=key;currentBimTab="systems";closeDevice(false);
  bimEngine.setSystem(key,currentScope,activeFloorIndex);
  $$(".system-tabs button").forEach(b=>b.classList.toggle("active",b.dataset.system===key));
  const floorBtn=$('.scope-switch button[data-scope="floor"]');if(floorBtn)floorBtn.disabled=activeFloorIndex===null;
  $$(".scope-switch button").forEach(b=>b.classList.toggle("active",b.dataset.scope===currentScope));
  renderSystemPanel();updateTwinNavigation();$("#themeName").textContent=SYSTEM_CONFIG[key].short+"透视";
}

function renderDeviceDrawer(){
  const d=selectedDevice;if(!d)return;
  const cfg=SYSTEM_CONFIG[d.system],isAlarm=d.status==="alarm",isAck=d.status==="ack";
  $("#deviceSystem").textContent=cfg.name;$("#deviceName").textContent=d.label;$("#deviceCode").textContent=d.code;
  $("#deviceStatus").className="device-status "+(isAlarm?"alarm":isAck?"warn":"ok");
  $("#deviceStatus").textContent=isAlarm?"● 活动告警":isAck?"● 已确认":"● 在线";
  $("#deviceLocation").textContent=(selected?.userData?.building?.name||"楼宇")+" / "+d.floor+" / "+d.room;
  $("#deviceTelemetry").innerHTML=d.telemetry.map((x,i)=>{
    const value=(isAlarm&&d.type==="smoke"&&i===0)?"1.86":x[1];
    return '<div><small>'+x[0]+'</small><b>'+value+'</b><em>'+x[2]+'</em></div>';
  }).join("");
  $("#deviceTrend").innerHTML=d.trend.map((v,i)=>'<i style="height:'+Math.min(100,(isAlarm&&i>10?v+35:v))+'%"></i>').join("");
  const events=(isAlarm?[{time:"刚刚",text:"设备触发告警 · 待处置",alarm:true}]:[]).concat(d.events).slice(0,4);
  $("#deviceEvents").innerHTML=events.map(e=>'<p class="'+(e.alarm?"alarm":"")+'"><b>'+e.time+'</b>　'+e.text+'</p>').join("");
  $("#ackDevice").disabled=!isAlarm;
}
function openDevice(d){
  selectedDevice=d;bimEngine?.selectDevice(d.id);
  $("#deviceDrawer").classList.add("show");$(".viewer-shell").classList.add("device-open");$("#bimPanel").classList.add("device-covered");
  renderDeviceDrawer();renderSystemPanel();updateTwinNavigation();$("#themeName").textContent=SYSTEM_CONFIG[d.system].short+" · 单设备";
  $$(".system-device-item").forEach(b=>b.classList.toggle("active",b.dataset.device===d.id));
}
function closeDevice(updateNav=true){
  selectedDevice=null;bimEngine?.clearDeviceSelection();
  $("#deviceDrawer")?.classList.remove("show");$(".viewer-shell")?.classList.remove("device-open");$("#bimPanel")?.classList.remove("device-covered");
  $$(".system-device-item").forEach(b=>b.classList.remove("active"));
  if(updateNav)updateTwinNavigation();
}
function locateDevice3D(){
  if(!selectedDevice)return;
  bimEngine.selectDevice(selectedDevice.id);showToast("已定位 "+selectedDevice.label);
}
function simulateAlarm(){
  const devices=currentDevices();if(!devices.length){showToast("当前范围没有可演练设备");return}
  const d=devices.find(x=>x.type==="smoke")||devices.find(x=>x.type==="camera")||devices[0];
  d.status="alarm";d.events.unshift({time:"刚刚",text:"数字孪生告警演练触发",alarm:true});bimEngine.setDeviceStatus(d.id,"alarm");
  renderSystemPanel();openDevice(d);showToast(d.label+" 已触发模拟告警","alarm");
}
function clearAlarm(){
  currentDevices().forEach(d=>{d.status="online";bimEngine.setDeviceStatus(d.id,"online")});
  if(selectedDevice)renderDeviceDrawer();renderSystemPanel();showToast(SYSTEM_CONFIG[currentSystem].name+" 演练状态已清除");
}
function acknowledgeDevice(){
  if(!selectedDevice||selectedDevice.status!=="alarm")return;
  selectedDevice.status="ack";selectedDevice.events.unshift({time:"刚刚",text:"告警已由值班员确认"});bimEngine.setDeviceStatus(selectedDevice.id,"ack");
  renderDeviceDrawer();renderSystemPanel();showToast("已确认 "+selectedDevice.label+" 告警");
}
function createDeviceWorkOrder(){
  if(!selectedDevice)return;
  const no="WO-"+new Date().toISOString().slice(5,10).replace("-","")+String(Math.floor(100+Math.random()*899));
  selectedDevice.workOrder=no;selectedDevice.events.unshift({time:"刚刚",text:"已生成运维工单 "+no});
  renderDeviceDrawer();showToast("已生成工单 "+no);
}

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
    const l=b.dataset.level;
    if(l==="campus")backToCampus();
    else if(l==="building"){closeDevice(false);setBimTab("overview")}
    else if(l==="floor"&&fi!==null){closeDevice(false);setBimTab("floors");selectFloor(fi)}
    else if(l==="system"){closeDevice(false);setBimTab("systems")}
  }));
  const parts=[selected?.userData?.building?.name||"楼宇"];
  if(activeFloorIndex!==null)parts.push(floorDefs[activeFloorIndex].name);
  if(currentBimTab==="systems")parts.push(SYSTEM_CONFIG[currentSystem].short);
  if(selectedDevice)parts.push(selectedDevice.label);
  $("#sceneCrumb").textContent=parts.join(" / ");
}
async function enterBimMode(){
  if(!selected)return;
  const ok=await ensureBimModel();if(!ok)return;
  viewMode="bim";controls.autoRotate=false;$("#autoRotate").classList.remove("active");
  world.visible=false;if(selectedHelper)selectedHelper.visible=false;
  $("#viewer").classList.add("xkt-active");bimEngine.show();
  $("#buildingCard").classList.remove("show");$("#bimPanel").classList.add("show");$(".viewer-shell").classList.add("bim-active");
  $("#tabs").style.display="none";$("#themeName").textContent="楼宇 BIM";
  $("#bimBuildingName").textContent=selected.userData.building.name+" · BIM精细模型";
  $("#bimModeText").textContent="XKT DTX / "+Number(bimEngine.objectCount).toLocaleString()+" 构件 / "+(bimEngine.loadMs/1000).toFixed(2)+"s";
  $("#assetBadge").textContent="XKT BIM · Schependomlaan CC BY 4.0";
  resetFloors(true);currentScope="building";setBimTab("overview");updateTwinNavigation();bimEngine.resetView();
}
function backToCampus(){
  if(viewMode!=="bim")return;
  closeDevice(false);resetFloors(true);bimEngine?.resetView();bimEngine?.hide();
  viewMode="campus";$("#viewer").classList.remove("xkt-active");world.visible=true;if(selectedHelper)selectedHelper.visible=true;
  $("#bimPanel").classList.remove("show");$(".viewer-shell").classList.remove("bim-active");$("#tabs").style.display="grid";
  $("#sceneCrumb").textContent="园区空间态势";const active=$("#tabs button.active");$("#themeName").textContent=themeNames[active?.dataset.theme||"general"];
  $("#assetBadge").textContent="Campus LOD · Quaternius CC0";updateTwinNavigation();homeCampusView();
}
function setBimTab(tab){
  currentBimTab=tab;closeDevice(false);
  $$(".bim-tabs button").forEach(b=>b.classList.toggle("active",b.dataset.bimtab===tab));
  $$(".bim-pane").forEach(p=>p.classList.toggle("active",p.dataset.bimpane===tab));
  if(tab==="overview"){
    activeFloorIndex=null;currentScope="building";resetFloors(true);bimEngine?.resetView();$("#themeName").textContent="楼宇 BIM";
  }else if(tab==="floors"){
    bimEngine?.hideSystems();bimEngine?.resetBimEmphasis();$("#themeName").textContent="楼层抽屉";
  }else if(tab==="systems"){
    currentScope=activeFloorIndex!==null?"floor":"building";setSystemMode(currentSystem);
  }
  updateTwinNavigation();
}

/* campus picking remains Three.js */
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
  $("#bcName").textContent=d.name;$("#bcType").textContent=d.type;$("#bcDevices").textContent=s[0];$("#bcPeople").textContent=s[1];$("#bcEnergy").textContent=s[2];$("#bcAlarm").textContent=s[3];$("#buildingCard").classList.add("show");
}
function setPointer(x,y){
  const rect=renderer.domElement.getBoundingClientRect();
  pointer.x=((x-rect.left)/rect.width)*2-1;pointer.y=-((y-rect.top)/rect.height)*2+1;raycaster.setFromCamera(pointer,camera);
}
function pickCampus(x,y){
  setPointer(x,y);const hits=raycaster.intersectObjects(buildingGroup.children,true);if(!hits.length)return null;
  let root=hits[0].object.userData.buildingRoot;if(!root){let p=hits[0].object;while(p&&p.parent!==buildingGroup)p=p.parent;root=p}
  if(root?.userData?.building)selectBuilding(root);return root;
}
let down=null;
renderer.domElement.addEventListener("pointerdown",e=>{if(viewMode==="campus")down=[e.clientX,e.clientY]});
renderer.domElement.addEventListener("pointerup",e=>{if(viewMode!=="campus"||!down)return;const d=Math.hypot(e.clientX-down[0],e.clientY-down[1]);if(d<5)pickCampus(e.clientX,e.clientY);down=null});
renderer.domElement.addEventListener("dblclick",e=>{if(viewMode==="campus"){const p=pickCampus(e.clientX,e.clientY);if(p)focusOn(p)}});
function flyCamera(startPos,startTarget,endPos,endTarget,duration=700){
  const t0=performance.now();controls.autoRotate=false;$("#autoRotate").classList.remove("active");
  function step(now){const t=Math.min(1,(now-t0)/duration),e=1-Math.pow(1-t,3);camera.position.lerpVectors(startPos,endPos,e);controls.target.lerpVectors(startTarget,endTarget,e);controls.update();if(t<1)requestAnimationFrame(step)}
  requestAnimationFrame(step);
}
function focusOn(obj){
  const box=new THREE.Box3().setFromObject(obj),center=new THREE.Vector3(),size=new THREE.Vector3();box.getCenter(center);box.getSize(size);
  const radius=Math.max(size.x,size.y,size.z),endPos=center.clone().add(new THREE.Vector3(1,.72,1).normalize().multiplyScalar(radius*2.35+12));
  flyCamera(camera.position.clone(),controls.target.clone(),endPos,center.clone().add(new THREE.Vector3(0,size.y*.15,0)),780);
}
function homeCampusView(){flyCamera(camera.position.clone(),controls.target.clone(),new THREE.Vector3(92,74,100),new THREE.Vector3(0,7,0),700)}
function homeView(){viewMode==="bim"?bimEngine?.resetView():homeCampusView()}

$("#closeCard").addEventListener("click",()=>$("#buildingCard").classList.remove("show"));
$("#focusBuilding").addEventListener("click",()=>selected&&focusOn(selected));
$("#enterBim").addEventListener("click",enterBimMode);
$("#backCampus").addEventListener("click",backToCampus);
$$(".bim-tabs button").forEach(b=>b.addEventListener("click",()=>setBimTab(b.dataset.bimtab)));
$("#resetFloors").addEventListener("click",()=>{resetFloors(true);updateTwinNavigation();bimEngine?.resetView()});
$("#explodeFloors").addEventListener("click",explodeAllFloors);
$$(".system-tabs button").forEach(b=>b.addEventListener("click",()=>setSystemMode(b.dataset.system)));
$$(".scope-switch button").forEach(b=>b.addEventListener("click",()=>setScope(b.dataset.scope)));
$("#simulateAlarm").addEventListener("click",simulateAlarm);
$("#clearAlarm").addEventListener("click",clearAlarm);
$("#closeDevice").addEventListener("click",()=>closeDevice());
$("#locateDevice").addEventListener("click",locateDevice3D);
$("#ackDevice").addEventListener("click",acknowledgeDevice);
$("#createWorkOrder").addEventListener("click",createDeviceWorkOrder);
$("#homeView").addEventListener("click",homeView);
$("#zoomIn").addEventListener("click",()=>{if(viewMode==="bim")bimEngine?.zoom(.82);else camera.position.lerp(controls.target,.12)});
$("#zoomOut").addEventListener("click",()=>{if(viewMode==="bim")bimEngine?.zoom(1.18);else{const d=camera.position.clone().sub(controls.target).multiplyScalar(1.14);camera.position.copy(controls.target).add(d)}});
$("#autoRotate").addEventListener("click",e=>{
  if(viewMode==="bim"){showToast("BIM模式：左键旋转 · 滚轮缩放 · 右键平移");return}
  controls.autoRotate=!controls.autoRotate;e.currentTarget.classList.toggle("active",controls.autoRotate);
});

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
  requestAnimationFrame(animate);const t=clock.getElapsedTime();
  if(viewMode==="campus"){
    controls.update();
    markers.forEach(m=>{const r=m.userData.ring,s=1+(Math.sin(t*2.5+m.userData.pulseOffset)+1)*.23;r.scale.setScalar(s);r.material.opacity=.25+(Math.sin(t*2.5+m.userData.pulseOffset)+1)*.18});
    pool.material.emissiveIntensity=.24+(Math.sin(t*1.4)+1)*.07;
    if(selectedHelper&&selected)selectedHelper.box.setFromObject(selected);
    updateLabels();composer.render();
  }
}
animate();
$("#modelState").textContent="本地 GLB 模型：已就绪";
$("#loading").classList.add("done");
setTimeout(()=>$("#loading").remove(),700);
document.addEventListener("keydown",e=>{
  if(e.key==="Escape"){
    modal.classList.remove("show");
    if(selectedDevice){closeDevice();return}
    if(viewMode==="bim")backToCampus();else $("#buildingCard").classList.remove("show");
  }
});
const debugParams=new URLSearchParams(location.search);
if(debugParams.get("bim")==="1"){
  setTimeout(async()=>{
    selectBuilding(buildings[0]);await enterBimMode();
    const floor=Number(debugParams.get("floor"));
    if(Number.isInteger(floor)&&floor>=0&&floor<floorDefs.length){setBimTab("floors");selectFloor(floor);enterSelectedFloor()}
    const sys=debugParams.get("system");
    if(sys&&SYSTEM_CONFIG[sys]){setBimTab("systems");setSystemMode(sys)}
  },220);
}
