# Web-Presentation

统一管理多个 Web Presentation 项目的工作仓库。

本仓库用于保存各项目的内容基线、视觉设计、页面源码、资源、QA 结果、发布版本与项目状态；具体的制作方法、引导流程与自动化规则由 [`web-presentation-builder`](https://github.com/sunkai-hit/skills/tree/main/web-presentation-builder) Skill 负责。

## 仓库定位

- `projects/`：各个 Web Presentation 项目的独立工作区
- `templates/`：新项目初始化模板
- `shared/`：跨项目可复用的组件、样式、资源与脚本
- `tools/web-presentation/`：仓库级通用构建、QA 与 Release 工具链
- `docs/`：仓库规范、项目生命周期、命名、发布约定与审计报告
- `.github/workflows/`：参数化验证与发布自动化

## 项目索引

详见 [`PROJECTS.md`](./PROJECTS.md)。

## 多项目工作区状态

仓库已完成从“OPC 单项目根目录结构”到“多项目工作区”的完整迁移与最终完整性审计：

1. 多项目仓库骨架已建立；
2. OPC 已完整迁入 `projects/opc-talent-community/`；
3. 公共工具链与参数化 GitHub Actions 已建立并通过完整 staging 回归；
4. 根目录历史 OPC 专属目录、旧版工具和旧版 Workflow 已清理；
5. 新项目模板已校准为公共工具链可直接执行的配置 schema；
6. 最终完整性审计已通过。

最终审计报告：[`docs/final-integrity-audit-2026-09-11.md`](./docs/final-integrity-audit-2026-09-11.md)

> 稳定发布物保存在各项目自己的 `projects/<slug>/release/<version>/` 中。Git 历史保留此前所有根目录结构与提交记录。
