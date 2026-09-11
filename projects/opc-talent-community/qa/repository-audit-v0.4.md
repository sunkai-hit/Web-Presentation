# V0.4 GitHub 全量结构与引用核验报告

核验时间：2026-09-10

## 1. 仓库结构

V0.4 相关内容按职责划分为：

- `design/`：设计系统与视觉增强规则
- `spec/`：页面实施规格、内容基线、全量制作清单
- `prototype/full-v0.4/`：20 屏模块化正式源码
- `qa/`：关键页反馈、页面 QA、Contact Sheet 与阶段检查点
- `release/v0.4/`：正式离线 HTML、发布 ZIP、校验值与发布说明

## 2. 模块化源码引用核验

`prototype/full-v0.4/index.html` 引用：

- `css/part-1.css`
- `css/part-2.css`
- `css/part-3.css`
- `css/part-4.css`
- `screens/screens-01-05.js`
- `screens/screens-06-10.js`
- `screens/screens-11-15.js`
- `screens/screens-16-20.js`
- `app.js`

以上引用均有对应仓库文件。

Screen 01–20 共 20 个唯一 `data-screen` 编号，编号连续，无缺页。

`app.js` 与 4 份 Screen JS 均通过 Node.js 语法检查。

## 3. 图片 / 图形依赖

- Screen 02 的正式单文件 HTML 已内嵌揭牌现场图片，不依赖外部网络。
- 模块化源码保留图片源快照与 SVG 兜底素材；其余中医药、人才、流程、生态、合规、数据等视觉主要由 SVG / CSS 图形实现。
- 最终发布 HTML 不存在外部网络脚本、样式或图片依赖。

## 4. 正式单文件 HTML 核验

文件：`数智健康OPC国际人才社区_Web_Presentation_V0.4.html`

- 文件大小：235181 bytes
- SHA-256：`68d872dbfff982726e225d2f8a85f6a0395279de11370a6f9e79e177ac89fb9b`
- 页面数量：20
- 浏览器脚本错误：0
- `showScreen()` 页面切换函数：正常
- 1920×1080 边界检查：Screen 02–20 无可见元素越界；Screen 01 仅本草装饰 SVG 按设计主动出血裁切，不影响正文和主视觉。

## 5. QA 预览

- 20 屏均已完成 1920×1080 浏览器渲染。
- 已生成并提交全量 Contact Sheet，供快速检查页面节奏、信息密度和视觉一致性。
- Screen 01 / 06 / 08 / 12 继续保持用户确认通过的关键页设计基线。

## 6. 发布结论

V0.4 已满足本轮发布条件：

- 20 屏完整
- 核心交互可用
- 单文件离线运行
- 模块化源码可追溯
- 设计 / 规格 / QA / Release 链路完整
- 关键事实性指标与演示性数据已进行区分，示意数据未作为真实运营数据表达

结论：**V0.4 可作为当前正式 Web Presentation 基线版本。**
