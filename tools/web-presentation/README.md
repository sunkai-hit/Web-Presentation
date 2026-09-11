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

OPC 历史专用工具已经归位到 `projects/opc-talent-community/tools/`，与仓库级公共工具链分离。OPC 项目配置已适配公共工具链 schema，并使用 staging 输出，避免覆盖既有稳定 Release。

## 3-5 已完成

已建立通用 `validate-web-presentation.yml` 与参数化 `finalize-web-presentation.yml`。OPC V0.4.1 已通过共享工具链完整 staging 回归，验证了源码审计、资源校验、浏览器布局检查、Standalone 构建、逐页渲染、Contact Sheet、ZIP 与 SHA256 输出链路。

## 第四步已完成

历史根目录 OPC 专用 `spec/`、`design/`、`prototype/`、`qa/`、`release/`、旧版 finalize 脚本、图片恢复目录及两个版本绑定 Workflow 已清理。对应内容仍完整保存在 `projects/opc-talent-community/` 与 Git 历史中。

下一步：执行最终仓库完整性审计。
