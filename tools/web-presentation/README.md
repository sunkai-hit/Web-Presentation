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

其中布局审计现在区分“可滚动溢出”和“被 `overflow:hidden/clip` 明确裁剪的内容”：前者作为失败条件，后者作为告警记录。

## 3-3 已完成

- `build_contact_sheet.py`
- `package_release.py`
- `finalize_release.py`

统一入口：

```bash
python tools/web-presentation/finalize_release.py projects/<project-slug>/web-presentation.yaml
```

## 3-4 已完成

OPC 历史专用工具已经归位到 `projects/opc-talent-community/tools/`，与仓库级公共工具链分离。项目配置采用 staging 输出，避免覆盖稳定 Release。

## 3-5 已完成

仓库已经增加两套通用 GitHub Actions：

- `.github/workflows/validate-web-presentation.yml`：自动发现 `projects/*/web-presentation.yaml`，执行完整 staging 回归；
- `.github/workflows/finalize-web-presentation.yml`：支持按 `config_path` 参数手动或复用式执行正式 finalize 流程，并可选择是否回写生成物。

OPC V0.4.1 已使用公共工具链完成一次完整 GitHub Actions staging 回归，Run `34574105229` 结果为 `success`，QA 与 staging Release 作为 Artifact 保存。

## 下一阶段

公共工具链与参数化 Actions 已验证，可以进入旧根目录清理阶段。清理前仍应遵循“项目工作区是新基线、历史稳定 Release 不改写”的原则。
