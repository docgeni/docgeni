---
title: API Annotations
path: 'api'
order: 50
toc: menu
---

Docgeni generates API documentation from JSDoc annotation tags on components, directives, services, pipes, classes, interfaces, properties, and methods.

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

- Type: `string`
- Default: `{ClassName}`

The name shown in the API docs. For components, directives, services, classes, and interfaces, the class name is used by default. For pipes, the `name` is used.

## @description

- Type: `string`
- Default: `null`

The description text. If a `@description` tag is present, its content takes precedence; otherwise the main comment body is used.

```ts
/**
 * Default description.
 * @name alib-button
 * @description This is description
 * @order 1
 */
```

## @order

- Type: `number`
- Default: `null`

Sort order in the API docs. Lower values appear first.

## @private

- Type: `boolean`
- Default: `false`
- Alias: `internal`

The following members are included in the API docs by default:

- All components, directives, services, and pipes
- `@Input` and `@Output` properties on components and directives
- Public methods on components, directives, services, and pipes

Add `@private` or `@internal` to exclude internal members that should not appear in the docs.

```ts
/**
 * General Button Component description.
 * @private
 */
```

## @public

- Type: `boolean`
- Default: `false`
- Alias: `publicApi`

Classes and interfaces are excluded from the API docs by default. Add `@public` or `@publicApi` to include them.

```ts
/**
 * Some Class description.
 * @public
 */
export class SomeClass {}
```

## @default

- Type: `string`
- Default: `null`

The default value is inferred from the TypeScript assignment when available. You can also set it explicitly with `@default`.

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

- Type: `string`
- Default: `null`

The property type is inferred from the TypeScript type definition when available. You can also set it explicitly with `@type`.

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

- Type: `string`
- Default: `null`

Describes a method parameter. Format: `@param {type} name description`.

```ts
@Injectable({
    providedIn: 'root'
})
export class DialogService {
    /**
     * Open a dialog
     * @param {string} param1 param1 desc
     * @param {number} param2 param2 desc
     * @returns DialogRef
     */
    open(param1: string, param2: number): DialogRef {}
}
```
