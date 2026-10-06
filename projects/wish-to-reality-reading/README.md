# 从“显化”到习惯：愿望是怎么影响现实的？

本项目以四本书为主线，讨论愿望如何经过未来图景、现实障碍、行为、习惯与叙事身份，最终影响现实中的选择和长期结果。

## 当前状态

- 状态：`Planning / Page Design Complete`
- 下一版本：`v1.0.0`
- 当前内容稿：[`spec/v1.0-full-page-content.md`](./spec/v1.0-full-page-content.md)
- 当前页面设计稿：[`spec/v1.0-page-design.md`](./spec/v1.0-page-design.md)
- 当前不指定正式入口；下一步进入整套单文件 HTML 制作。
- 项目规则：[`.project/content-production-rules.md`](./.project/content-production-rules.md)
- 视觉基线：[`.project/visual-baseline.md`](./.project/visual-baseline.md)

## v1.0 重构原则

这次不再使用“统一卡片模板 + 批量填充内容”的方式。生产顺序固定为：

1. 完整内容稿；
2. 逐页页面设计稿（内容关系、主视觉、阅读顺序、结论位置）；
3. 依据设计稿分批制作整套单文件 HTML；
4. 每批做内容覆盖检查、页面实现检查和浏览器截图检查；
5. 全量视觉 QA 通过后，才指定正式入口。

当前已完成第 1、2 步：34 页完整逐页内容稿与整套页面设计稿。后续页面制作必须以这两份文件为源，不得再次压缩成“几个框里几句话”。

“电影院陈爆米花实验”demo 是主体知识页的最低复杂度基准：页面必须有核心视觉、完整解释过程、具体案例/实验、机制或对照关系、结论/迁移。

## 清理说明

v0.6.0–v0.11.0 为连续试错版本，因生产方式未达到上述标准，已从项目工作区清理，不再作为后续实现基线。

## 保留历史参考

- `prototype/v0.1.0/`
- `prototype/v0.2.0/`
- `prototype/v0.3.0/`
- `prototype/v0.4.0/`
- `prototype/v0.5.0/`

这些仅作为历史参考，不代表 v1.0 的实现方式。
