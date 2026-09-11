# Shared Web Presentation Toolchain

仓库级、跨项目复用的 Web Presentation 构建、QA 与 Release 工具目录。

## 3-1 已完成

- `common.py`
- `audit_source.py`
- `validate_assets.py`
- `requirements.txt`

## 3-2 已完成

- `build_standalone.py`
- `render_pages.py`
- `audit_layout.py`

## 3-3 已完成

- `build_contact_sheet.py`
- `package_release.py`
- `finalize_release.py`

统一入口：

```bash
python tools/web-presentation/finalize_release.py projects/<project-slug>/web-presentation.yaml
```

## 3-4 已完成

OPC 历史专用工具已经归位到 `projects/opc-talent-community/tools/`，与仓库级公共工具链分离。OPC 项目配置也已适配公共工具链 schema，并使用 staging 输出，避免覆盖既有稳定 Release。

历史根目录 `tools/finalize_v04.py`、`tools/finalize_v041.py` 与 `tools/opc-reveal-b64/` 暂时保留，用于迁移兼容；待 3-5 回归通过后再进入旧根目录清理阶段。

## 暂未完成

- 3-5：参数化 GitHub Actions 与回归验证。
