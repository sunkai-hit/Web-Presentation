# Web Presentation V0.4.1 模块化源码

本目录基于已确认的 V0.4 视觉基线进行增量精修，原 `prototype/full-v0.4/` 不覆盖。

本轮重点：第二页使用用户新提供的揭牌照片并放大阶段卡；第九页重排课程模块和下方双栏；第十四页整体下移；第十六页补齐项目运营信息；全局提升非大标题文字可读性；Screen 01/03/05/11/13/15/17/18/20 的总分结构向中心收拢并放大分部件。

`part-1.css` ~ `part-4.css`、四份 Screen JS 和 `app.js` 继承 V0.4 基线；`part-5.css` 与 `screens/v0.4.1-patch.js` 为本轮增量修订。

## Revalidation

2026-09-11：在清理重复构建脚本后，重新触发正式 `Finalize Web Presentation V0.4.1` 流程，用于验证当前 `main` 分支仍可从模块化源码稳定重建 Standalone HTML、ZIP、20屏 Contact Sheet 与校验文件。
