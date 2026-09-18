# 修订记录

## v0.3.1
- 将 v0.3.0 使用的 Quaternius CC0 GLB 模型正式下载到本项目；
- 新增 `assets/models/`，保存 3 个建筑模型、3 个树木模型和 1 个灌木模型；
- 保存 `LICENSE-quaternius.txt`，继续保留来源与授权追溯；
- `app.js` 改为从本地 `./assets/models/` 加载，不再运行时访问远程模型地址；
- 新增 `start-local.bat`，便于 Windows 本地一键启动 HTTP 服务；
- 新增 `download-assets.ps1` 作为模型重新下载备用脚本；
- 保持原 Three.js 场景、自由旋转、缩放、平移、建筑高亮/聚焦及业务看板联动。

## v0.3.0
- 放弃“程序化自建建筑模型”作为中央园区主体的路线；
- 引入 Quaternius Downtown City MegaKit 的 CC0 1.0 开源 GLB 建筑资产；
- 使用大 / 中 / 小型建筑模型组合 6 栋园区楼宇；
- 引入 Quaternius 树木、灌木模型构建园区绿化；
- 保留 Three.js OrbitControls 旋转、缩放、平移及自动环绕；
- 增加楼宇单击高亮、双击聚焦和运行信息卡；
- 增加 EffectComposer + UnrealBloomPass，优化整体数字孪生视觉；
- 保留道路、停车、广场、水景、路灯和安防/能耗/设施点位；
- 增加模型来源及 CC0 授权追溯文件 CREDITS.md。

## v0.2.0
- 重构中央园区模型，放弃 V0.1.0 的 SVG 伪 2.5D 方案；
- 引入 Three.js WebGL 真实三维场景；
- 增加 OrbitControls 左键旋转、滚轮缩放、右键平移；
- 增加自动旋转与园区视角复位；
- 增加程序化低模建筑及园区环境。

## v0.1.0
- 新建 IBMS 智慧园区运营中心项目工作区；
- 完成深蓝科技大屏视觉框架；
- 完成中央 2.5D SVG 园区示意模型；
- 完成周边数据看板基础下钻。
