# IBMS 智慧园区运营中心原型

本项目用于验证 IBMS 园区管理大屏及数字孪生交互方式。

## 当前版本：v0.6.0

v0.6.0 已形成完整的五级数字孪生交互链路：

`园区 LOD → 楼宇 BIM → 楼层 → 专业系统 → 单设备`

整体采用双引擎结构：

- **园区总览**：Three.js + Quaternius CC0 GLB，负责轻量园区鸟瞰、楼宇选择、旋转/缩放/平移。
- **楼宇 BIM**：xeokit + XKT，负责构件级 BIM、楼层抽屉、系统透视和单设备下钻。

### 主要交互

1. 园区层：建筑点击、高亮、聚焦、运营摘要；
2. 楼宇层：进入精细 BIM，点击墙、门、窗、楼板等 BIM 构件查看 IFC 信息；
3. 楼层层：按真实 IfcBuildingStorey 识别楼层，支持单层抽屉拉出和整楼拆层；
4. 专业系统层：消防、安防、暖通、电气四种透视模式，并支持“全楼 / 当前楼层”范围切换；
5. 单设备层：设备列表、3D 定位、实时指标、趋势、事件、模拟告警、告警确认和生成工单。

### 性能优化

v0.5.0 使用的详细 BIM 为二进制 GLB，约 **14.06 MB**；v0.6.0 改用 BIM 专用 XKT，模型文件约 **1.60 MB**，体积下降约 **89%**。

专用 Chrome Headless 冒烟测试已通过：

- BIM 构件：3,510；
- BIM 楼层：6；
- XKT 模型加载：约 2.20 秒；
- 从页面启动到“楼层 + 消防系统 + 设备列表”完整链路就绪：约 10.48 秒（GitHub Linux 软件渲染环境）；
- 已自动验证模拟告警、设备抽屉、告警确认和工单生成。

实际 Windows 独显/核显环境通常会比 CI 软件渲染更顺畅，但具体时间取决于终端性能。

## 原型入口

- 当前版本：`prototype/key-screen-v0.6.0/index.html`
- 上一版本：`prototype/key-screen-v0.5.0/index.html`

## Windows 本地启动

不要直接双击 `index.html`，请双击：

`prototype/key-screen-v0.6.0/start-local.bat`

默认访问：

`http://127.0.0.1:8092/`

## 模型和许可

- 园区 LOD：Quaternius Downtown City MegaKit，CC0 1.0；
- BIM 样例：Schependomlaan，CC BY 4.0；
- Three.js：MIT；
- xeokit SDK：仓库当前许可证为 AGPL-3.0。若后续作为闭源商业产品正式交付，需要在产品化前确认许可证方案或替换为满足项目许可要求的 BIM 引擎。

当前消防/安防/暖通/电气专业层是用于验证 IBMS 交互的演示设备层，并非 Schependomlaan 原始 MEP 数据。实际项目接入真实 IFC/Revit/MEP 模型后，可保持现有交互框架并替换为真实专业构件和设备数据。

详见：`prototype/key-screen-v0.6.0/CREDITS.md`。
