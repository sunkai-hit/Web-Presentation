import {
  Viewer,
  XKTLoaderPlugin,
  FastNavPlugin,
  Mesh,
  VBOGeometry,
  PhongMaterial,
  buildSphereGeometry,
  buildBoxGeometry,
  buildCylinderGeometry
} from "./vendor/xeokit/xeokit-sdk.min.es.js";

const SYSTEMS={
  fire:{color:0xff5d6c,name:"消防系统"},
  security:{color:0x03affe,name:"安防系统"},
  hvac:{color:0x63c7ff,name:"暖通系统"},
  power:{color:0xffb547,name:"电气系统"}
};

function rgb(hex){return [((hex>>16)&255)/255,((hex>>8)&255)/255,(hex&255)/255]}
function uniq(a){return [...new Set(a)]}
function centerOf(aabb){return [(aabb[0]+aabb[3])/2,(aabb[1]+aabb[4])/2,(aabb[2]+aabb[5])/2]}
function sizeOf(aabb){return [aabb[3]-aabb[0],aabb[4]-aabb[1],aabb[5]-aabb[2]]}

export async function createBimTwin({
  canvasId="xeokitCanvas",
  src="./assets/bim/Schependomlaan.ifc.xkt",
  onObjectPick=()=>{},
  onDevicePick=()=>{},
  onProgress=()=>{}
}={}){
  const t0=performance.now();
  const viewer=new Viewer({
    canvasId,
    transparent:true,
    saoEnabled:true,
    entityOffsetsEnabled:true,
    dtxEnabled:true
  });

  viewer.scene.canvas.canvas.style.background="transparent";
  viewer.scene.camera.perspective.near=0.05;
  viewer.scene.camera.perspective.far=5000;
  viewer.scene.xrayMaterial.fillColor=[0.08,0.45,0.62];
  viewer.scene.xrayMaterial.edgeColor=[0.12,0.65,0.82];
  viewer.scene.xrayMaterial.fillAlpha=0.075;
  viewer.scene.xrayMaterial.edgeAlpha=0.14;
  viewer.scene.highlightMaterial.fillColor=[0.0,0.82,1.0];
  viewer.scene.highlightMaterial.edgeColor=[0.3,0.95,1.0];
  viewer.scene.highlightMaterial.fillAlpha=0.35;
  viewer.scene.highlightMaterial.edgeAlpha=1.0;
  viewer.scene.selectedMaterial.fillColor=[0.0,0.72,1.0];
  viewer.scene.selectedMaterial.edgeColor=[0.4,1.0,1.0];
  viewer.scene.selectedMaterial.fillAlpha=0.30;
  viewer.scene.selectedMaterial.edgeAlpha=1.0;

  new FastNavPlugin(viewer,{
    hideEdges:true,
    hideSAO:true,
    hideColorTexture:true,
    hidePBR:true,
    hideTransparentObjects:false,
    scaleCanvasResolution:true,
    scaleCanvasResolutionFactor:0.55,
    delayBeforeRestore:true,
    delayBeforeRestoreSeconds:0.25
  });

  const loader=new XKTLoaderPlugin(viewer);
  onProgress("正在读取 XKT BIM · 约 1.6MB");
  const model=loader.load({
    id:"ibmsBimModel",
    src,
    edges:true,
    saoEnabled:true,
    dtxEnabled:true,
    objectDefaults:{
      IfcPlate:{opacity:0.28},
      IfcWindow:{opacity:0.38},
      IfcSpace:{opacity:0.08}
    }
  });

  await new Promise((resolve,reject)=>{
    let done=false;
    const timer=setTimeout(()=>{if(!done){done=true;reject(new Error("XKT BIM load timeout"))}},30000);
    model.on("loaded",()=>{if(done)return;done=true;clearTimeout(timer);resolve()});
    try{model.on("error",(e)=>{if(done)return;done=true;clearTimeout(timer);reject(e instanceof Error?e:new Error(String(e)))})}catch{}
  });

  const loadMs=performance.now()-t0;
  const scene=viewer.scene;
  const metaScene=viewer.metaScene;
  const allMeta=Object.values(metaScene.metaObjects||{});
  const storeys=allMeta.filter(o=>o.type==="IfcBuildingStorey");

  const floors=storeys.map(o=>{
    const objectIds=uniq(metaScene.getObjectIDsInSubtree(o.id)||[]);
    const aabb=scene.getAABB(objectIds);
    return {id:o.id,name:o.name||"楼层",objectIds,aabb,center:centerOf(aabb),size:sizeOf(aabb)};
  }).filter(f=>f.objectIds.length).sort((a,b)=>a.center[1]-b.center[1]);

  floors.forEach((f,i)=>f.index=i);
  const allObjectIds=uniq(floors.flatMap(f=>f.objectIds));
  const floorByObject=new Map();
  floors.forEach(f=>f.objectIds.forEach(id=>floorByObject.set(id,f)));

  const modelAabb=model.aabb||scene.getAABB(allObjectIds);
  const [sx,sy,sz]=sizeOf(modelAabb);
  const scaleUnit=Math.max(0.09,Math.min(sx,sz)*0.012);

  onProgress("XKT BIM 已就绪 · "+model.numEntities+" 构件 · "+(loadMs/1000).toFixed(2)+"s");
  viewer.cameraFlight.jumpTo({aabb:modelAabb,fitFOV:38});

  let selectedObjectId=null;
  let selectedDeviceId=null;
  let activeSystem=null;
  let scope="building";
  let scopeFloorIndex=null;

  const devices=[];
  const deviceById=new Map();
  const systemMeshes={fire:[],security:[],hvac:[],power:[]};
  const systemBuilt={fire:false,security:false,hvac:false,power:false};

  const sphereGeom=new VBOGeometry(scene,buildSphereGeometry({radius:1,heightSegments:8,widthSegments:12}));
  const boxGeom=new VBOGeometry(scene,buildBoxGeometry({xSize:1,ySize:1,zSize:1}));
  const cylinderGeom=new VBOGeometry(scene,buildCylinderGeometry({center:[0,0,0],radiusTop:1,radiusBottom:1,height:1,radialSegments:8,heightSegments:1,openEnded:false}));
  const materialCache=new Map();
  function material(hex){
    const key=String(hex);
    if(materialCache.has(key))return materialCache.get(key);
    const c=rgb(hex);
    const m=new PhongMaterial(scene,{diffuse:c,emissive:c.map(v=>v*.35),shininess:60});
    materialCache.set(key,m);return m;
  }
  function addMesh(system,cfg){
    const m=new Mesh(scene,{...cfg,visible:false,pickable:cfg.pickable!==false,clippable:false,collidable:false,castsShadow:false,receivesShadow:false});
    systemMeshes[system].push(m);
    return m;
  }
  function addPipe(system,a,b,radius,color){
    const dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2];
    const len=Math.sqrt(dx*dx+dy*dy+dz*dz);
    const pos=[(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2];
    let rotation=[0,0,0];
    if(Math.abs(dx)>=Math.abs(dy)&&Math.abs(dx)>=Math.abs(dz))rotation=[0,0,90];
    else if(Math.abs(dz)>=Math.abs(dy))rotation=[90,0,0];
    return addMesh(system,{
      geometry:cylinderGeom,material:material(color),position:pos,rotation,
      scale:[radius,len,radius],pickable:false
    });
  }
  function telemetry(type,seed){
    if(type==="smoke")return [["烟雾浓度",(0.04+seed*.002).toFixed(2),"ppm"],["温度",(23.4+seed*.13).toFixed(1),"℃"],["电池",96-seed%7,"%"],["信号",-44-seed%9,"dBm"]];
    if(type==="sprinkler")return [["末端压力",(0.44-seed*.003).toFixed(2),"MPa"],["阀门","开启",""],["流量","0.0","L/s"],["巡检","正常",""]];
    if(type==="camera")return [["码率",(3.1+seed*.07).toFixed(1),"Mbps"],["帧率","25","fps"],["存储","正常",""],["AI分析","在线",""]];
    if(type==="access")return [["门状态","关闭",""],["今日通行",28+seed*2,"人次"],["控制器","在线",""],["电压","12.1","V"]];
    if(type==="fcu")return [["送风温度",(18.1+seed*.08).toFixed(1),"℃"],["风速","2档",""],["阀门","62","%"],["功率","0.42","kW"]];
    if(type==="panel")return [["电压","380","V"],["电流",30+seed,"A"],["功率因数","0.96",""],["温度",31+seed%3,"℃"]];
    return [["状态","正常",""],["在线","是",""],["信号","良好",""],["巡检","正常",""]];
  }
  function addDevice(system,type,label,pos,color,floorIndex,seq,shape="sphere"){
    const id="IBMS::"+system+"::"+String(floorIndex+1).padStart(2,"0")+"::"+String(seq).padStart(3,"0");
    const mesh=addMesh(system,{
      id,isObject:true,
      geometry:shape==="box"?boxGeom:sphereGeom,
      material:material(color),
      position:pos,
      scale:shape==="box"?[scaleUnit*1.4,scaleUnit,scaleUnit*1.4]:[scaleUnit,scaleUnit,scaleUnit]
    });
    const d={
      id,code:system.toUpperCase()+"-"+String(floorIndex+1).padStart(2,"0")+"-"+String(seq).padStart(3,"0"),
      system,type,label,mesh,floorIndex,floor:floors[floorIndex]?.name||("F"+(floorIndex+1)),
      room:["走廊东区","核心筒","办公区A","设备间","公共区"][seq%5],
      status:"online",normalColor:color,telemetry:telemetry(type,seq),
      trend:Array.from({length:14},(_,i)=>34+((seq*7+i*11)%48)),
      events:[{time:"08:30",text:"自动巡检通过"},{time:"昨日 17:42",text:"状态上报正常"}],
      workOrder:null
    };
    mesh.ibmsDevice=d;
    devices.push(d);deviceById.set(id,d);
    return d;
  }

  function buildSystem(system){
    if(systemBuilt[system])return;
    systemBuilt[system]=true;
    let seq=0;
    floors.forEach((floor,fi)=>{
      const a=floor.aabb,c=floor.center,fs=floor.size;
      const minX=a[0]+fs[0]*.12,maxX=a[3]-fs[0]*.12,minZ=a[2]+fs[2]*.12,maxZ=a[5]-fs[2]*.12;
      const y=a[1]+fs[1]*.66;
      if(system==="fire"){
        addPipe(system,[minX,y,c[2]],[maxX,y,c[2]],scaleUnit*.22,0xff5d6c);
        addPipe(system,[c[0],y,minZ],[c[0],y,maxZ],scaleUnit*.18,0xff5d6c);
        for(let n=0;n<6;n++){
          const x=minX+(n+.7)*(maxX-minX)/6.7,z=n%2?c[2]+fs[2]*.18:c[2]-fs[2]*.18;
          addDevice(system,"sprinkler","喷淋头 "+(fi+1)+"-"+(n+1),[x,y,z],0xff5d6c,fi,++seq);
        }
        for(let n=0;n<3;n++){
          const x=minX+(n+1)*(maxX-minX)/4;
          addDevice(system,"smoke","智能烟感 "+(fi+1)+"-"+(n+1),[x,y+scaleUnit*1.8,c[2]],0xffb547,fi,++seq);
        }
        addDevice(system,"hydrant","消火栓箱 "+(fi+1),[minX,a[1]+fs[1]*.42,minZ],0xff5d6c,fi,++seq,"box");
        addDevice(system,"manual","手动报警按钮 "+(fi+1),[maxX,a[1]+fs[1]*.46,maxZ],0xffb547,fi,++seq,"box");
      }else if(system==="security"){
        [[minX,minZ],[maxX,minZ],[minX,maxZ],[maxX,maxZ]].forEach((p,n)=>{
          addDevice(system,"camera","摄像机 "+(fi+1)+"-"+(n+1),[p[0],y+scaleUnit,p[1]],0x03affe,fi,++seq);
        });
        addDevice(system,"access","门禁控制器 "+(fi+1),[c[0],a[1]+fs[1]*.38,minZ],0x32d583,fi,++seq,"box");
        addDevice(system,"intrusion","入侵探测器 "+(fi+1),[maxX,y,c[2]],0xffb547,fi,++seq);
      }else if(system==="hvac"){
        addPipe(system,[minX,y,c[2]-fs[2]*.16],[maxX,y,c[2]-fs[2]*.16],scaleUnit*.5,0x63c7ff);
        addPipe(system,[minX,y,c[2]+fs[2]*.16],[maxX,y,c[2]+fs[2]*.16],scaleUnit*.42,0x32d583);
        for(let n=0;n<4;n++){
          const x=minX+(n+1)*(maxX-minX)/5;
          addDevice(system,"fcu","风机盘管 "+(fi+1)+"-"+(n+1),[x,y,c[2]-fs[2]*.16],0x63c7ff,fi,++seq,"box");
        }
        addDevice(system,"thermostat","温控器 "+(fi+1),[c[0],a[1]+fs[1]*.5,maxZ],0x32d583,fi,++seq,"box");
      }else if(system==="power"){
        addPipe(system,[minX,y,c[2]],[maxX,y,c[2]],scaleUnit*.16,0xffb547);
        for(let n=0;n<3;n++){
          const x=minX+(n+1)*(maxX-minX)/4;
          addDevice(system,"panel","智能配电箱 "+(fi+1)+"-"+(n+1),[x,a[1]+fs[1]*.38,minZ],0xffb547,fi,++seq,"box");
        }
        addDevice(system,"meter","智能电表 "+(fi+1),[maxX,a[1]+fs[1]*.45,c[2]],0x32d583,fi,++seq,"box");
      }
    });
  }

  function hideSystems(){
    for(const arr of Object.values(systemMeshes))for(const m of arr)m.visible=false;
  }
  function clearFloorOffsets(){
    for(const f of floors)scene.setObjectsOffset(f.objectIds,[0,0,0]);
  }
  function resetBimEmphasis(){
    scene.setObjectsXRayed(allObjectIds,false);
    scene.setObjectsPickable(allObjectIds,true);
    scene.setObjectsVisible(allObjectIds,true);
    clearFloorOffsets();
  }
  function setFloorDrawer(index){
    resetBimEmphasis();hideSystems();
    const f=floors[index];if(!f)return;
    scene.setObjectsXRayed(allObjectIds,true);
    scene.setObjectsXRayed(f.objectIds,false);
    scene.setObjectsOffset(f.objectIds,[Math.max(2.5,sx*.16),0,0]);
    viewer.cameraFlight.flyTo({aabb:f.aabb,duration:.45,fitFOV:34});
  }
  function explodeFloors(){
    resetBimEmphasis();hideSystems();
    const mid=(floors.length-1)/2;
    floors.forEach((f,i)=>scene.setObjectsOffset(f.objectIds,[0,(i-mid)*Math.max(1.3,sy*.085),0]));
    viewer.cameraFlight.flyTo({aabb:modelAabb,duration:.5,fitFOV:42});
  }
  function setSystem(system,newScope="building",floorIndex=null){
    activeSystem=system;scope=newScope;scopeFloorIndex=floorIndex;
    buildSystem(system);resetBimEmphasis();hideSystems();
    scene.setObjectsXRayed(allObjectIds,true);
    scene.setObjectsPickable(allObjectIds,false);
    if(scope==="floor"&&Number.isInteger(floorIndex)&&floors[floorIndex]){
      const f=floors[floorIndex];
      scene.setObjectsXRayed(f.objectIds,true);
      viewer.cameraFlight.flyTo({aabb:f.aabb,duration:.45,fitFOV:36});
    }else{
      viewer.cameraFlight.flyTo({aabb:modelAabb,duration:.45,fitFOV:40});
    }
    for(const m of systemMeshes[system]){
      const d=m.ibmsDevice;
      if(d)m.visible=scope!=="floor"||floorIndex===null||d.floorIndex===floorIndex;
      else{
        const fi=m.systemFloorIndex;
        m.visible=scope!=="floor"||floorIndex===null||fi===floorIndex;
      }
    }
  }
  function setPipeFloorTags(){
    for(const key of Object.keys(systemMeshes)){
      let currentFloor=0;
      const arr=systemMeshes[key];
      // Devices have explicit floor index; pipes receive nearest floor by Y.
      for(const m of arr){
        if(m.ibmsDevice)continue;
        const y=m.position?.[1]??0;
        let best=0,dist=Infinity;
        floors.forEach((f,i)=>{const d=Math.abs(y-f.center[1]);if(d<dist){dist=d;best=i}});
        m.systemFloorIndex=best;
      }
    }
  }
  const originalBuildSystem=buildSystem;
  function ensureSystem(system){
    originalBuildSystem(system);
    setPipeFloorTags();
  }
  function getDevices(system=activeSystem,newScope=scope,floorIndex=scopeFloorIndex){
    ensureSystem(system);
    return devices.filter(d=>d.system===system&&(newScope!=="floor"||floorIndex===null||d.floorIndex===floorIndex));
  }
  function setDeviceStatus(id,status){
    const d=deviceById.get(id);if(!d)return;
    d.status=status;
    if(status==="alarm"){
      d.mesh.colorize=[1,.18,.22];d.mesh.highlighted=true;
    }else if(status==="ack"){
      d.mesh.colorize=[1,.62,.22];d.mesh.highlighted=true;
    }else{
      d.mesh.colorize=[1,1,1];d.mesh.highlighted=false;
    }
  }
  function selectDevice(id){
    if(selectedDeviceId&&deviceById.get(selectedDeviceId))deviceById.get(selectedDeviceId).mesh.selected=false;
    selectedDeviceId=id;
    const d=deviceById.get(id);if(!d)return null;
    d.mesh.visible=true;d.mesh.selected=true;
    viewer.cameraFlight.flyTo({aabb:d.mesh.aabb,duration:.35,fitFOV:25});
    return d;
  }
  function clearDeviceSelection(){
    if(selectedDeviceId&&deviceById.get(selectedDeviceId))deviceById.get(selectedDeviceId).mesh.selected=false;
    selectedDeviceId=null;
  }
  function focusObject(id){
    const entity=scene.objects[id];if(entity)viewer.cameraFlight.flyTo({aabb:entity.aabb,duration:.4,fitFOV:28});
  }
  function resetView(){
    resetBimEmphasis();hideSystems();clearDeviceSelection();
    viewer.cameraFlight.flyTo({aabb:modelAabb,duration:.45,fitFOV:40});
  }

  viewer.cameraControl.on("picked",(pick)=>{
    const entity=pick?.entity;if(!entity)return;
    if(deviceById.has(entity.id)){
      const d=selectDevice(entity.id);
      onDevicePick(d);
      return;
    }
    if(!floorByObject.has(entity.id))return;
    if(selectedObjectId)scene.setObjectsHighlighted([selectedObjectId],false);
    selectedObjectId=entity.id;scene.setObjectsHighlighted([entity.id],true);
    const meta=metaScene.metaObjects[entity.id];
    const floor=floorByObject.get(entity.id);
    onObjectPick({
      id:entity.id,
      name:meta?.name||entity.id,
      type:meta?.type||"BIM Object",
      floor:floor?.name||"未归类",
      aabb:entity.aabb
    });
  });
  viewer.cameraControl.on("doublePicked",(pick)=>{
    if(pick?.entity&&!deviceById.has(pick.entity.id))focusObject(pick.entity.id);
  });

  return {
    viewer,model,floors,objectCount:model.numEntities||allObjectIds.length,loadMs,modelAabb,
    resetView,resetBimEmphasis,setFloorDrawer,explodeFloors,setSystem,getDevices,
    setDeviceStatus,selectDevice,clearDeviceSelection,focusObject,hideSystems,
    ensureSystem,
    show(){viewer.scene.canvas.canvas.style.display="block"},
    hide(){viewer.scene.canvas.canvas.style.display="none"}
  };
}
