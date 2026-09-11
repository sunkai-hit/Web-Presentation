# 数智健康 OPC 国际人才社区 Web Presentation

本目录是 `opc-talent-community` 在 Web-Presentation 多项目仓库中的正式项目工作区。

## 项目状态

- 项目类型：领导汇报型 Web Presentation
- 当前稳定版本：`v0.4.1`
- 当前阶段：`Released`
- 页面数量：20
- 迁移状态：项目内容、历史工具、公共工具链和参数化 GitHub Actions 均已完成验证；下一步仅剩旧根目录清理。

## 目录说明

- `.project/`：项目状态、内容/视觉基线、页面清单、修订记录、QA 与迁移状态
- `spec/`：页面内容与实施规格
- `design/`：设计系统、视觉规范与设计令牌
- `prototype/`：阶段原型与正式模块化源码
- `qa/`：逐页 QA、Contact Sheet、审计与变更记录
- `release/`：稳定交付版本与共享工具链 staging 输出
- `tools/`：OPC 历史项目专用构建脚本；新版本优先使用仓库级 `tools/web-presentation/`
- `legacy-workflows/`：历史 OPC 专用 GitHub Actions 备份

## 构建方式

推荐使用公共工具链：

```bash
python tools/web-presentation/finalize_release.py projects/opc-talent-community/web-presentation.yaml
```

当前配置默认写入 `release/_staging/v0.4.1/`，不会覆盖 `release/v0.4.1/` 稳定发布物。

## GitHub Actions

- 自动回归：`.github/workflows/validate-web-presentation.yml`
- 参数化发布：`.github/workflows/finalize-web-presentation.yml`

OPC V0.4.1 已完成完整 staging 回归，GitHub Actions Run `34574105229` 为 `success`。

## 稳定基线

`release/v0.4.1/` 仍是正式稳定基线。根目录历史路径目前仅为兼容保留，已经满足进入清理阶段的条件。
