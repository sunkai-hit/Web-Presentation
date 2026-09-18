# 修订记录

## v0.3.2
- 解决“加载本地模型一直转圈”问题；
- 将 Three.js 0.180.0 核心运行库和所需 Addons 本地化到 `vendor/three/`；
- 使用 import map 将 `three` 映射到本地运行库；
- 保持 7 个 Quaternius CC0 GLB 模型全部本地加载；
- 增加 12 秒页面启动 Watchdog；
- 增加单模型 10 秒加载超时和失败数量提示；
- 加载失败时显示明确错误，不再无限 Loading；
- 本地启动端口从 8080 调整为 8088，降低旧服务占用造成的版本混淆；
- 参考 Edge-Gateway V0.7 极简配置页重构前端控件；
- 采用 Edge-Gateway 的深色工业控制台配色、细边框、小圆角、蓝色标题强调条、扁平按钮与状态色；
- 减少原版大屏中过强的霓虹、玻璃和 HUD 装饰；
- 保留中央 Three.js 园区场景与全部业务交互。

## v0.3.1
- 将 Quaternius CC0 GLB 模型正式下载到本项目；
- 新增 `assets/models/`，保存建筑、树木和灌木模型；
- `app.js` 改为从本地模型目录加载；
- 新增 Windows 本地启动脚本。

## v0.3.0
- 引入 Quaternius Downtown City MegaKit 的 CC0 1.0 开源 GLB 资产；
- 停止以程序化 BoxGeometry 作为主要楼宇资产；
- 保留 Three.js 自由旋转、缩放、平移和业务点位。

## v0.2.0
- 从 SVG 伪 2.5D 升级为 Three.js 三维场景。

## v0.1.0
- 建立 IBMS 智慧园区大屏初始原型。
