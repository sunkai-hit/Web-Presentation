# IBMS 智慧园区运营中心原型

本项目用于验证 IBMS 园区管理大屏的视觉与交互方式。

## 当前版本：v0.3.2

本版重点解决两个问题：

1. **“加载本地模型一直转圈”**：Three.js 运行库也已本地化，不再依赖 jsDelivr；同时增加 12 秒启动监测和模型加载错误提示，不再无限转圈。
2. **前端控件风格统一**：参考 Edge-Gateway 项目 `prototype/edge-gateway-local-console-v0.7/index2.html` 的视觉语言，重新设计顶部、卡片、按钮、Tab、弹窗、状态标签和加载状态。

### v0.3.2 已完成

- 7 个 Quaternius CC0 GLB 模型继续本地存放；
- Three.js 0.180.0 核心运行库已存放在 `vendor/three/`；
- OrbitControls、GLTFLoader、EffectComposer、RenderPass、UnrealBloomPass 及所需依赖全部本地化；
- 页面通过 import map 将 `three` 指向本地 `three.module.js`；
- 模型单文件加载增加 10 秒超时；
- 页面启动增加 12 秒 Watchdog，运行库或模型异常时直接显示原因；
- 本地启动端口调整为 `8088`，避免旧版 8080 服务残留造成版本混淆；
- 前端颜色、边框、按钮、面板、状态色参考 Edge-Gateway：
  - 背景 `#041323`
  - 面板 `#06182C`
  - 二级面板 `#071D33`
  - 边框 `#083253`
  - 主蓝 `#03AFFE`
  - 正常 `#32D583`
  - 警告 `#FFB547`
  - 告警 `#FF5D6C`
- 控件从“强科技 HUD”调整为更克制的工业控制台 / 企业管理端风格；
- 中央三维园区仍保留自由旋转、缩放、平移、自动环绕、建筑点击与聚焦；
- 左右 8 个业务看板继续支持详情下钻。

## 原型入口

- 当前版本：`prototype/key-screen-v0.3.2/index.html`
- 上一版本：`prototype/key-screen-v0.3.1/index.html`

## Windows 本地启动

不要直接双击 `index.html`，请双击：

`prototype/key-screen-v0.3.2/start-local.bat`

浏览器会打开：

`http://127.0.0.1:8088/`

## 运行依赖

v0.3.2 的 Three.js、GLB 模型和核心 Three.js Addons 均已纳入本项目目录。启动页面后不再依赖 CDN 下载这些三维运行资源。

## 模型来源

建筑及自然环境模型来自 **Quaternius Downtown City MegaKit**，授权为 **CC0 1.0 Universal**。详见 `prototype/key-screen-v0.3.2/CREDITS.md`。
