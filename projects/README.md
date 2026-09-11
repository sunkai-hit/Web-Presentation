# Projects

每个 Web Presentation 项目使用独立目录：

```text
projects/<project-slug>/
├── README.md
├── web-presentation.yaml
├── .project/
├── spec/
├── design/
├── prototype/
├── assets/
├── qa/
├── release/
└── tools/
```

项目之间不得共用版本号语义或相互写入 Release。跨项目复用内容应进入仓库根目录的 `shared/` 或 `tools/`。
