---
category: general
title: Button
subtitle: 按钮
order: 1
label: new
---

## 定义

> 按钮用于开始一个即时操作。

## 何时使用

标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。

##  模块导入
```ts
import { AlibButtonModule } from "a-lib/button";
```

## 按钮种类
在 ALib 示例组件中，我们有四种按钮。

- 主按钮：用于主行动点，一个操作区域只能有一个主按钮。
- 默认按钮：用于没有主次之分的一组行动点。
- 虚线按钮：常用于添加操作。
- 链接按钮：用于次要或外链的行动点。

以及四种状态属性与上面配合使用。

1. 危险：删除/移动/修改权限等危险操作，一般需要二次确认。
1. 幽灵：用于背景色比较复杂的地方，常用在首页/产品页等展示场景。
1. 禁用：行动点不可用的时候，一般需要文案解释。
1. 加载中：用于异步操作等待反馈的时候，也可以避免多次提交。

## 如何使用
<!--example()-->

直接使用`alibButton`指令在原有的按钮元素上扩展：

```html
<button alibButton="primary">按钮</button>
```

直接使用`alib-button`组件：

```html
<alib-button alibType="primary">按钮</alib-button>
```


<examples />
