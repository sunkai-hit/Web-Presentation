# Web-Presentation

统一管理多个 Web Presentation 项目的工作仓库。

本仓库用于保存各项目的内容基线、视觉设计、页面源码、资源、QA 结果、发布版本与项目状态；具体的制作方法、引导流程与自动化规则由 [`web-presentation-builder`](https://github.com/sunkai-hit/skills/tree/main/web-presentation-builder) Skill 负责。

## 仓库定位

- `projects/`：各个 Web Presentation 项目的独立工作区
- `templates/`：新项目初始化模板
- `shared/`：跨项目可复用的组件、样式、资源与脚本
- `tools/`：仓库级通用构建与 QA 工具
- `docs/`：仓库规范、项目生命周期、命名与发布约定
- `.github/`：GitHub Actions 与仓库自动化

## 项目索引

详见 [`PROJECTS.md`](./PROJECTS.md)。

## 当前迁移状态

仓库正在从“单项目结构”升级为“多项目工作区”。当前根目录中的 `spec/`、`design/`、`prototype/`、`qa/`、`release/` 以及部分 `tools/`、`.github/workflows/` 仍属于历史 OPC 项目结构，暂时保留以保证现有版本可继续使用。

后续迁移顺序：

1. 建立多项目仓库骨架；
2. 将现有 OPC 项目完整迁入 `projects/opc-talent-community/`；
3. 重构公共工具与参数化 GitHub Actions；
4. 验证后清理根目录中的旧单项目结构；
5. 完成最终完整性审计。

> 原则：迁移期间不破坏任何现有稳定 Release；先复制与验证，再清理旧路径。
