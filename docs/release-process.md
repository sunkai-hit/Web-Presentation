# Release Process

每个项目独立发布，发布物不得直接混放在仓库根目录。

推荐流程：

1. 读取 `.project/` 中当前基线和 QA 状态；
2. 完成源码、资源和布局审计；
3. 生成 Standalone HTML；
4. 生成逐页截图与 Contact Sheet；
5. 打包 ZIP；
6. 生成 SHA256 与 Release Audit；
7. 写入 `projects/<slug>/release/<version>/`；
8. 更新项目 README、`.project/project-state.yaml` 与根目录 `PROJECTS.md`。

稳定 Release 不应被覆盖；修订应产生新版本或明确的补丁版本。
