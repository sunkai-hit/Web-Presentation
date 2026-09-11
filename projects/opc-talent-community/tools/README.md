# OPC Project Tools

本目录只保存 `opc-talent-community` 项目专用或历史兼容工具。

- `finalize_v04.py`：历史 v0.4 构建脚本；
- `finalize_v041.py`：历史 v0.4.1 构建脚本；
- `opc-reveal-b64/`：历史图片恢复片段，仅用于追溯，不作为当前构建源。

这些脚本保留原相对目录结构，因此仍以本项目目录作为 `ROOT`。新版本默认使用仓库级公共工具链：

```bash
python tools/web-presentation/finalize_release.py projects/opc-talent-community/web-presentation.yaml
```

注意：当前通用配置默认输出到 `release/_staging/v0.4.1/`，用于 3-5 回归验证，避免覆盖 `release/v0.4.1/` 稳定发布物。
