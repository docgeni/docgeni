---
title: API 注释
path: 'api'
order: 50
toc: menu
---

通过给组件/指令/服务/类/接口/属性/函数添加注释生成 API 文档。

```ts
/**
 * General Button Component description.
 * @name alib-button
 * @order 1
 */
@Component({
    selector: 'alib-button,[alibButton]',
    template: '<ng-content></ng-content>',
})
export class AlibButtonComponent extends Base implements OnInit {

    /**
     * Button Type: `'primary' | 'secondary' | 'danger'`
     * @description 按钮类型
     * @default primary
     * @type 'primary' | 'secondary' | 'danger'
     */
    @Input() set alibButton(value: string) {
        this.alibType = value;
    }

    ngOnInit(): void {}
}


```

## @name

- 类型：`string`
- 默认：`{ClassName}`

组件/指令/服务/类/接口的名称，默认根据 Class 类名。

## @description

- 类型：`string`
- 默认：``

组件/指令/服务/类/接口的名称的描述，如果有`@description` Tag 以次为主，否则以默认注释内容为描述。

```ts
/**
 * General Button Component description.
 * @name alib-button
 * @description This is description
 * @order 1
 */
```

## @order

- 类型：`number`
- 默认：`null`

API 文档的排序。

## @private

- 类型：`boolean`
- 默认：`false`
- 别名：`internal`

默认生成 API 文档的有：
- 所有的组件/指令/服务
- 组件/指令的 @Input 和 @Output 属性
- 组件/指令/服务的公开函数

以上的组件/指令/服务/属性/函数是内部的，不需要生成 API 文档，需要添加`@private`或者`@internal`即可。

```ts
/**
 * General Button Component description.
 * @private 
 */
```

## @public

- 类型：`boolean`
- 默认：`false`
- 别名：`publicApi`

默认所有的 Class 和 Interface 都不会生成 API 文档，如果某个 Class 和 Interface 需要生成 API 文档，需要添加`@public`或者`@publicApi`即可。

```ts
/**
 * Some Class description.
 * @public 
 */
export class SomeClass {}
```

## @default

- 类型：`string`
- 默认：`null`

属性的默认值会自动读取 TypeScript 的赋值语句，通过`@default`手动设置默认值。

```ts
export class AlibButtonComponent {
  /**
  * Button Type
  * @default primary
  */
  @Input() alibType = 'primary'
}
```

## @type

- 类型：`string`
- 默认：`null`

属性的类型会自动读取 TypeScript 的类型定义，通过`@type`手动设置默认值。

```ts
export class AlibButtonComponent {
  /**
  * Button Type
  * @type 'primary' | 'success'
  */
  @Input() alibType = 'primary'
}
```

## @param

- 类型：`string`
- 默认：`null`

函数参数描述。

```ts
@Injectable({
    providedIn: 'root'
})
export class DialogService {
    /**
     * Open a dialog
     * @param {string} pram1 pram1 desc
     * @param {number} pram2 pram2 desc
     * @returns DialogRef
     */
    open(pram1: string, pram2: number): DialogRef {}
}
```
