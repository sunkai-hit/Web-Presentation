# 修订记录

## v0.6.0
- 将详细 BIM 渲染从 Three.js GLB 切换为 xeokit XKT；
- Schependomlaan 详细模型由 v0.5.0 的约 14.06MB GLB 降至约 1.60MB XKT；
- 引入 xeokit Data Texture BIM 渲染与 FastNav；
- 园区层继续使用 Three.js，形成“轻量园区 + BIM 专用楼宇”的双引擎结构；
- 完成园区 LOD → 楼宇 BIM → 楼层 → 专业系统 → 单设备五级导航；
- 楼宇 BIM 支持构件点击、IFC 信息和双击聚焦；
- 楼层支持真实 IfcBuildingStorey、单层抽屉和整楼拆层；
- 专业系统支持消防、安防、暖通、电气，以及全楼 / 当前楼层范围；
- 单设备支持 3D 定位、遥测指标、趋势、事件、模拟告警、告警确认、生成工单；
- 专业设备层按需创建，BIM 资源在园区阶段空闲预取，避免首屏加载重 BIM；
- 专用 Headless Chrome smoke test 通过：3510 构件、6 层、XKT 引擎加载约 2.20 秒、完整测试链路约 10.48 秒。

## v0.5.0
- 将 23MB embedded glTF 转为约 14MB binary GLB；
- 完整实现楼层作用域、专业系统、单设备抽屉、告警与工单交互；
- 验证 Three.js 方案在大量 BIM 对象解析场景仍存在明显 CPU/软件渲染开销，为 v0.6.0 的 XKT 路线提供依据。

## v0.4.0
- 首次引入 Schependomlaan 精细 BIM 样例；
- 从园区低模进入构件级楼宇；
- 建立楼层抽屉、系统透视和构件信息查看原型。

## v0.3.2
- 本地化 Three.js 与园区 GLB；
- 解决远程依赖导致的 Loading 卡死；
- 按 Edge-Gateway 视觉语言重构前端控件。

## v0.3.1
- 将 Quaternius CC0 GLB 模型正式下载到本项目；
- 新增 Windows 本地启动脚本。

## v0.3.0
- 引入 Quaternius Downtown City MegaKit 开源 GLB 资产；
- 停止以程序化 BoxGeometry 作为主要楼宇资产。

## v0.2.0
- 从 SVG 伪 2.5D 升级为 Three.js 三维场景。

## v0.1.0
- 建立 IBMS 智慧园区大屏初始原型。
