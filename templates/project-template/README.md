# Web Presentation Project Template

复制本目录作为新项目起点，并重命名为 `projects/<project-slug>/`。

初始化后至少需要完成：

1. 修改 `web-presentation.yaml` 中的 `project_name`、`project_slug`、`release_version`、`source_dir`、输出文件名等字段；
2. 初始化 `.project/project-state.yaml`；
3. 建立内容与视觉基线；
4. 在仓库根目录 `PROJECTS.md` 登记项目；
5. 按 `spec/ → design/ → prototype/ → qa/ → release/` 生命周期推进；
6. 开发完成后使用仓库级公共工具链执行 QA 与 staging 构建。

公共工具链入口：

```bash
python tools/web-presentation/finalize_release.py projects/<project-slug>/web-presentation.yaml
```

也可以通过参数化 GitHub Actions `Finalize Web Presentation`，传入：

```text
projects/<project-slug>/web-presentation.yaml
```

项目级状态、版本和发布物必须彼此独立，不得与其他项目共用版本目录。默认使用 `release/_staging/<version>/` 进行验证，QA 通过后再形成正式稳定 Release。
