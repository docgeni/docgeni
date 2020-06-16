---
title: 快速开始
path: 'getting-started'
order: 3
---

# 脚手架初始化(WIP)
```
$ npx @docgeni/cli create
```

# 手动初始化
## 安装
新建一个文件夹，或者在切换到已有的项目中，执行下面命令安装 CLI 工具和模版：

```bash
$ npm i @docgeni/cli @docgeni/template --save-dev
# or 
$ yarn add @docgeni/cli @docgeni/template -D
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

# 配置
在根目录新建 `.docgenirc.js` 配置文件，拷贝如下配置代码:

```ts
module.exports = {
    mode: 'site',
    title: 'Docgeni',
    repoUrl: 'https://github.com/docgeni/docgeni',
    navs: [
        null,
        {
            title: 'GitHub',
            path: 'https://github.com/docgeni/docgeni',
            isExternal: true
        }
    ]
}
```
# 开始写文档

Docgeni 默认会自动查看`docs`目录下的 Markdown 文件，我们就可以先来一个最简单的文档。

```base
$ mkdir docs && echo '# Hello Docgeni!' > docs/index.md
```

执行 `npm run start:docs` 运行并打开 `http://127.0.0.1:4600` 地址访问试试


