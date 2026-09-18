# IBMS 智慧园区运营中心原型

本项目用于验证 IBMS 园区管理大屏的视觉与交互方式。

## 当前版本：v0.3.0

本版不再由程序自行“画楼”，而是采用 **Three.js + 开源 CC0 GLB 模型资产** 重构中央园区，以提高建筑细节、材质质感和整体真实感。

### v0.3.0 已完成

- 中央园区引入 Quaternius Downtown City MegaKit 的 CC0 建筑模型；
- 使用 `b_large.glb / b_medium.glb / b_small.glb` 组合 6 栋园区建筑；
- 使用 `tree1.glb / tree2.glb / tree3.glb / bush.glb` 构建园区绿化；
- 保留真实 Three.js 三维旋转、缩放、平移、自动环绕；
- 单击楼宇高亮并显示楼宇运行数据；
- 双击或点击“聚焦楼宇”自动移动镜头到目标建筑；
- 场景继续叠加园区道路、停车区、广场、水景、路灯、业务点位；
- 安防消防 / 能耗环境 / 设备设施切换会联动三维业务点位；
- 左右 8 个业务看板继续支持详情下钻；
- 增加 Unreal Bloom、阴影、雾效和 ACES 色调映射增强科技大屏质感；
- 已增加模型授权与来源说明：`prototype/key-screen-v0.3.0/CREDITS.md`。

## 原型入口

- 当前版本：`prototype/key-screen-v0.3.0/index.html`
- 上一版本：`prototype/key-screen-v0.2.0/index.html`
- 初始版本：`prototype/key-screen-v0.1.0/index.html`

## 中央模型交互

1. 左键拖动：旋转园区；
2. 鼠标滚轮：缩放；
3. 右键拖动：平移；
4. 点击建筑：高亮并查看楼宇运行摘要；
5. 双击建筑：自动聚焦；
6. 点击“聚焦楼宇”：定位目标建筑；
7. 点击“自动旋转”：开启/停止园区环绕；
8. 点击“⌂”：恢复园区总览；
9. 底部业务主题切换会联动三维点位。

## 模型来源

建筑及自然环境模型来自 **Quaternius Downtown City MegaKit**，授权为 **CC0 1.0 Universal**。当前原型通过固定 Git commit 的 jsDelivr 地址加载 Web 优化后的 GLB 模型，详见 `CREDITS.md`。

> 当前 Three.js 与 GLB 模型仍通过 CDN/远程静态地址加载，因此首次打开需要网络。下一步若确认此模型方向，可以将全部依赖和 GLB 模型本地化到项目 `assets/` 目录，制作完全离线版。
