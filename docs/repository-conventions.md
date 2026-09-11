# Repository Conventions

## 1. 仓库职责

`Web-Presentation` 保存实际项目与交付物；`web-presentation-builder` Skill 定义如何规划、设计、制作、QA 和发布。

## 2. 项目隔离

所有业务项目必须位于 `projects/<project-slug>/`。项目自己的 `spec`、`design`、`prototype`、`assets`、`qa`、`release`、`tools` 不得放在仓库根目录。

## 3. 稳定版本保护

不得直接覆盖已经发布的稳定版本。修订应生成新版本目录，并在项目状态与修订日志中记录。

## 4. 迁移规则

历史单项目内容采用“复制 → 校验 → 切换 → 清理”流程，禁止先删除旧路径再迁移。

## 5. 项目状态

每个项目应维护 `.project/project-state.yaml` 作为恢复上下文的主要入口，并配套内容基线、视觉基线、页面清单、修订日志和 QA 状态。
