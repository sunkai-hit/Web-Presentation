# IBMS 智慧园区运营中心原型

本项目用于验证 IBMS 园区管理大屏的视觉与交互方式。

## 当前版本：v0.3.1

本版在 v0.3.0 开源模型方案基础上，已将 Quaternius CC0 GLB 模型**正式下载并纳入项目目录**，页面运行时不再从远程地址加载建筑与绿化模型。

### v0.3.1 已完成

- 已将 7 个 GLB 模型下载到 `prototype/key-screen-v0.3.1/assets/models/`；
- 包含 `b_large.glb / b_medium.glb / b_small.glb`；
- 包含 `tree1.glb / tree2.glb / tree3.glb / bush.glb`；
- 已同步保存 `LICENSE-quaternius.txt`；
- `app.js` 已改为从本地 `./assets/models/` 加载；
- 新增 `start-local.bat`，用于 Windows 本地一键启动 HTTP 服务；
- 新增 `download-assets.ps1`，作为模型资产重新下载的备用脚本；
- 保留 Three.js 自由旋转、缩放、平移、自动环绕、建筑点击高亮、双击聚焦；
- 保留安防 / 能耗 / 设备空间点位和左右 8 个业务看板下钻。

## 原型入口

- 当前版本：`prototype/key-screen-v0.3.1/index.html`
- 上一版本：`prototype/key-screen-v0.3.0/index.html`

## 本地启动

由于 GLTFLoader 需要通过 HTTP 读取本地 GLB 文件，不建议直接双击 `index.html`。

Windows 下直接双击：

`prototype/key-screen-v0.3.1/start-local.bat`

浏览器会打开：

`http://127.0.0.1:8080/`

## 模型来源

建筑及自然环境模型来自 **Quaternius Downtown City MegaKit**，授权为 **CC0 1.0 Universal**。模型来源与授权信息详见 `prototype/key-screen-v0.3.1/CREDITS.md`。

> 当前模型文件已经本地化；Three.js 运行库仍通过 jsDelivr 加载。若后续需要完全断网运行，再继续将 Three.js 依赖本地化。
