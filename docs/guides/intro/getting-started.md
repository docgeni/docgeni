---
title: 快速上手
path: 'getting-started'
order: 30
toc: menu
---
# 环境准备
确保本地成功安装了 [Node](https://nodejs.org/en/) 和 NPM，Node >= 10.0.0。
```
$ node -v
v10.0.0
```

# 脚手架初始化
切换到已有的项目中，执行如下命令：

```bash
$ npx @docgeni/cli init
# 或者 
$ docgeni init 
# 或者
$ ng add @docgeni/cli
```

<alert>使用`docgeni init`初始化需要全局安装 @docgeni/cli `npm install -g @docgeni/cli`<br>
使用`ng add @docgeni/cli`初始化需要全局安装 Angular CLI `npm install -g @angular/cli`</alert>

执行上述任意一个命令后将自动完成 docgeni 的初始化配置，包括生成配置文件、NPM 启动脚本、默认文档等工作。
- 第一步选择文档站点模式: `full`或者`lite`(默认`lite`)
- 第二步输入文档目录 (默认`docs`)

<img class="mb-2" width="90%" style="padding-left: 5%;" src="https://cdn.pingcode.com/open-sources/docgeni/cli-init.png?4" />

初始化后，使用`npm run start:docs`启动文档站点，浏览器打开`http://127.0.0.1:4600` 即可访问。

Lite 模式的预览效果如下：
![](https://cdn.worktile.com/open-sources/docgeni/docgeni-lite-preview.png?2)

# 模板仓储初始化
我们提供了一个内置的 GitHub 模板仓储 [docgeni-template](https://github.com/docgeni/docgeni-template)。模板仓储默认使用`full`模式，且内置了一个`alib`组件库以及一些初始化配置，进入 [仓储模板首页](https://github.com/docgeni/docgeni-template) 点击右上角 "Use this template" 按钮。

<img class="mt-2" src="https://cdn.pingcode.com/open-sources/docgeni/use-docgeni-template.png" />

预览效果如下：
![](https://cdn.worktile.com/open-sources/docgeni/docgeni-template-preview.png?1)

# 手动初始化
## 安装
新建一个文件夹，或者切换到已有的项目中，执行下面命令安装 Docgeni CLI 和模版：

```bash
$ npm i @docgeni/cli @docgeni/template --save-dev
# 或者
$ yarn add @docgeni/cli @docgeni/template -D
```

安装后在`package.json`文件中添加如下脚本：

```json
{
  "scripts": {
    ...
    "start:docs": "docgeni serve --port 4600",
    "build:docs": "docgeni build --prod"
    ...
  }
}
```
## 配置
在根目录新建 `.docgenirc.js` 配置文件，拷贝如下配置代码:

```ts
/**
 * @type {import('@docgeni/core').DocgeniConfig}
 */
module.exports = {
    mode: 'lite',
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
## 开始写文档

Docgeni 默认会扫描`docs`目录下的 Markdown 文件，我们可以先创建一个最简单的文档。

```base
$ mkdir docs && echo 'Hello Docgeni!' > docs/getting-started.md
```

执行 `npm run start:docs` 运行并打开 `http://127.0.0.1:4600` 地址访问试试

## .gitignore 忽略`.docgeni/site`
Docgeni 默认会在`.docgeni/site`文件夹下生成文档站点，为了避免冲突，请把`.docgeni/site`文件夹添加到 .gitignore 中。


# 组件文档
Docgeni 初始化脚手架会自动检测并添加当前 Angular 项目中的类库，类库的组件如果没有编写文档和示例，则不会显示，可以按照 [组件文档、API和示例](basic/component) 文档要求编写组件文档、API和示例，比如：组件根目录下有一个`button`组件，在`button/doc`下创建一个`en-us.md`文档（注意需要以默认多语言的Key命名），输入如下内容：

```
---
title: 按钮
subtitle: Button
---

## 何时使用
按钮用于开始一个即时操作。
```
展示效果如下:

![Component](https://cdn.pingcode.com/open-sources/docgeni/docgeni-lite-component-preview.png)

关于组件文档更多的配置参考：[组件文档、API和示例](guides/basic/component)
