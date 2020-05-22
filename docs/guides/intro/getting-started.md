---
title: 快速开始
path: 'getting-started'
order: 2
---
# 脚手架初始化

# 手动初始化
## 安装

```bash
$ npm i @docgeni/cli --save-dev
# or 
$ yarn add @docgeni/cli -D
```
在`package.json`文件中添加如下脚本：

```json
{
  "scripts": {
    ...
    "start:docs": "docgeni serve --port 4600",
    "build:docs": "docgeni build"
    ...
  }
}
```
Docgeni 默认会自动查看`docs`目录下的 Markdown 文件，我们就可以先来一个最简单的文档。

```base
$ mkdir src && echo '# Hello Docgeni!' > docs/index.md
```

执行 `npm run start:docs` 运行并打开 `http://127.0.0.1:4600` 地址访问试试


