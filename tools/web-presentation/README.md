# Shared Web Presentation Toolchain

仓库级、跨项目复用的 Web Presentation 构建与 QA 工具目录。

## 3-1 已完成

第一批公共工具已经从 `web-presentation-builder` Skill 抽取到仓库：

- `common.py`：配置读取、路径解析、SHA256、图片遍历、Chrome 查找等公共函数；
- `audit_source.py`：检查入口 HTML、本地资源引用、Screen 编号和 JavaScript 语法；
- `validate_assets.py`：检查图片是否可解码、尺寸、文件大小和 SHA256；
- `requirements.txt`：公共工具的 Python 依赖。

这些工具都以项目根目录中的 `web-presentation.yaml` 为入口，因此可以服务 `projects/` 下的任意 Web Presentation 项目，不包含 OPC 项目特有逻辑。

## 暂未迁移

以下能力将在后续子步骤继续补齐：

- 3-2：Standalone 构建、页面渲染、布局审计；
- 3-3：Contact Sheet、Release 打包、统一 finalize 入口；
- 3-4：OPC 项目专用脚本归位与配置适配；
- 3-5：参数化 GitHub Actions 与回归验证。

当前根 `tools/finalize_v04.py`、`tools/finalize_v041.py` 以及 `tools/opc-reveal-b64/` 仍视为 OPC 历史专用工具，暂不删除；项目迁移副本也已保留在 `projects/opc-talent-community/tools/`。
