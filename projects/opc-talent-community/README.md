# 数智健康 OPC 国际人才社区 Web Presentation

本目录是 `opc-talent-community` 项目在 Web-Presentation 多项目仓库中的正式项目工作区。

## 项目状态

- 项目类型：领导汇报型 Web Presentation
- 当前稳定版本：`v0.4.1`
- 当前阶段：`Released`
- 页面数量：20
- 迁移状态：已从仓库根目录的历史单项目结构复制到本目录；旧路径暂时保留，待通用工具与 Workflow 完成重构后再清理。

## 目录说明

- `.project/`：项目状态、内容/视觉基线、页面清单、修订记录与 QA 状态
- `spec/`：页面内容与实施规格
- `design/`：设计系统、视觉规范与设计令牌
- `prototype/`：阶段原型与正式模块化源码
- `qa/`：逐页 QA、Contact Sheet、审计与变更记录
- `release/`：稳定交付版本
- `tools/`：历史项目专用构建脚本，后续第三阶段再与通用工具链拆分
- `legacy-workflows/`：历史项目专用 GitHub Actions 备份；真正执行中的 Workflow 仍暂时位于仓库根 `.github/workflows/`

## 稳定基线

当前稳定发布版本为 `v0.4.1`。迁移期间遵循“先复制、验证，再清理旧路径”的原则，不修改已有发布产物内容。
