# Web Presentation Projects

本文件是仓库级项目索引。每个正式项目均应在 `projects/<project-slug>/` 下拥有独立目录，并维护自己的版本、状态和 Release。

| Project | Slug | Current Version | Status | Path |
|---|---|---:|---|---|
| 数智健康 OPC 国际人才社区 | `opc-talent-community` | `v0.4.1` | Released / Migration QA | `projects/opc-talent-community/` |

## 状态约定

- `Planning`：内容架构或视觉方案阶段
- `Building`：页面制作中
- `QA`：质量检查与修订中
- `Released`：已有稳定发布版本
- `Released / Migration QA`：稳定版本已发布，多项目仓库迁移已完成主体结构，等待自动化回归验证
- `Archived`：归档，仅保留历史版本

新增项目时，需要同时创建 `projects/<slug>/`、初始化 `.project/` 状态文件，并在本表登记。
