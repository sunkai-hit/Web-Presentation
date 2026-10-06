# v0.6.0 QA 记录

## 提交物

- `.project/content-production-rules.md`：项目专属内容密度与视觉规则。
- `spec/v0.6.0-full-page-content.md`：34 页完整逐页内容稿。
- `prototype/v0.6.0/index.html`：v0.6.0 Web PPT 单文件原型。

## 中间产物回读检查

- 已回读 `.project/content-production-rules.md`，确认规则写入成功。
- 已回读 `spec/v0.6.0-full-page-content.md`，确认逐页内容稿写入成功。
- 已回读 `prototype/v0.6.0/index.html`，确认原型文件写入成功。

## 内容规则检查

按 `.project/content-production-rules.md` 检查：

- 主体页不再只写主题词，均改为完整问题或完整知识单元。
- 故事 / 实验页包含背景、过程、结果、解释和现实迁移。
- 流程图节点补充了定义、机制和例子。
- 每页保留结论句或转场句。
- v0.6.0 仍需后续在真实浏览器中继续做逐页视觉细修，尤其关注过长文本与局部卡片视觉密度。

## 本地视觉 QA

在本地用 Chromium / Playwright 对 v0.6.0 本地构建版做了 1600×900 视口检查：

- Slide 数量：34。
- DOM 边界检查：0 个 slide 检测到内容超出 slide 边界。
- 滚动高度检查：0 个 slide 检测到 inner scrollHeight 超过 clientHeight。
- 抽检截图：封面、章节图、Shinn 机制图、WOOP 流程图、爆米花实验页、四书总循环图、最终区分页。

## 需要后续继续优化的方向

- 可以在 v0.7.0 引入真正图片资产（作者照片、书封、实验示意插画），进一步减少纯卡片感。
- 可以将部分信息量较大的页面做成轻微动画或分步出现，增强阅读顺序。
- 可以继续做移动端适配，目前以 16:9 投屏 / 桌面展示为主。
