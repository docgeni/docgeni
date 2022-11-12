# @docgeni/ngdoc

> Angular Component/Directive/Pipe/Service doc generator

## Usage

```ts
import { NgDocParser } from '@docgeni/ngdoc';
const docs = NgDocParser.parse(__dirname + '/button.component.ts');
console.log(JSON.stringify(docs, null, 2));
```

Input: 
```ts

/**
 * General Button Component description.
 * @name alib-button
 */
@Component({
    selector: 'alib-button,[alibButton]',
    template: '<ng-content></ng-content>'
})
export class AlibButtonComponent implements OnInit {
    @HostBinding(`class.dg-btn`) isBtn = true;

    private type: string;
    private loading = false;

    /**
     * Button Type: `'primary' | 'secondary' | 'danger'`
     * @description 按钮类型
     * @default primary
     * @type 'primary' | 'secondary' | 'danger'
     */
    @Input() set alibButton(value: string) {
        this.alibType = value;
    }

    /**
     * 和 alibButton 含义相同，一般使用 alibButton，为了减少参数输入, 设置按钮组件通过 alib-button 时，只能使用该参数控制类型
     * @default primary
     */
    @Input() set alibType(value: string) {
        if (this.type) {
            this.elementRef.nativeElement.classList.remove(`dg-btn-${this.type}`);
        }
        this.type = value;
        this.elementRef.nativeElement.classList.add(`dg-btn-${this.type}`);
    }

    /**
     * Button Size
     * @default md
     */
    @Input() alibSize: 'xs' | 'sm' | 'md' | 'lg' = 'xs';

    /**
     * Input  of alib button component
     * @type string
     */
    @Input('alibAliasName') alibLengthTooLongLengthTooLong: 'TypeLengthTooLongLengthTooLongLengthTooLong';

    /**
     * Button loading status
     * @default false
     */
    @Input() set thyLoading(loading: boolean) {
        this.loading = loading;
    }

    /**
     * Loading Event
     */
    @Output() thyLoadingEvent = new EventEmitter<boolean>();

    @ContentChild('template') templateRef: TemplateRef<unknown>;

    constructor(private elementRef: ElementRef<HTMLElement>) {}

    ngOnInit(): void {}
}
```

Output:

```json
[
  {
    "type": "component",
    "name": "alib-button",
    "className": "AlibButtonComponent",
    "description": "General Button Component description.",
    "order": 9007199254740991,
    "selector": "alib-button,[alibButton]",
    "templateUrl": null,
    "template": "<ng-content></ng-content>",
    "styleUrls": null,
    "styles": null,
    "exportAs": null,
    "properties": [
      {
        "kind": "Input",
        "name": "alibButton",
        "aliasName": "",
        "type": {
          "name": " 'primary' | 'secondary' | 'danger'",
          "options": null
        },
        "description": "按钮类型",
        "default": "primary",
        "tags": {
          "description": {
            "name": "description",
            "text": [
              {
                "text": "按钮类型",
                "kind": "text"
              }
            ]
          },
          "default": {
            "name": "default",
            "text": [
              {
                "text": "primary",
                "kind": "text"
              }
            ]
          },
          "type": {
            "name": "type",
            "text": [
              {
                "text": "",
                "kind": "text"
              },
              {
                "text": " ",
                "kind": "space"
              },
              {
                "text": "'primary' | 'secondary' | 'danger'",
                "kind": "text"
              }
            ]
          }
        }
      },
      {
        "kind": "Input",
        "name": "alibType",
        "aliasName": "",
        "type": {
          "name": "string",
          "options": null
        },
        "description": "和 alibButton 含义相同，一般使用 alibButton，为了减少参数输入, 设置按钮组件通过 alib-button 时，只能使用该参数控制类型",
        "default": "primary",
        "tags": {
          "default": {
            "name": "default",
            "text": [
              {
                "text": "primary",
                "kind": "text"
              }
            ]
          }
        }
      },
      {
        "kind": "Input",
        "name": "alibSize",
        "aliasName": "",
        "type": {
          "name": "\"xs\" | \"sm\" | \"md\" | \"lg\"",
          "options": [
            "xs",
            "sm",
            "md",
            "lg"
          ],
          "kindName": "UnionType"
        },
        "description": "Button Size",
        "default": "md",
        "tags": {
          "default": {
            "name": "default",
            "text": [
              {
                "text": "md",
                "kind": "text"
              }
            ]
          }
        }
      },
      {
        "kind": "Input",
        "name": "alibLengthTooLongLengthTooLong",
        "aliasName": "alibAliasName",
        "type": {
          "name": "string",
          "options": null,
          "kindName": "LiteralType"
        },
        "description": "Input  of alib button component",
        "default": null,
        "tags": {
          "type": {
            "name": "type",
            "text": [
              {
                "text": "string",
                "kind": "text"
              }
            ]
          }
        }
      },
      {
        "kind": "Input",
        "name": "thyLoading",
        "aliasName": "",
        "type": {
          "name": "boolean",
          "options": null
        },
        "description": "Button loading status",
        "default": "false",
        "tags": {
          "default": {
            "name": "default",
            "text": [
              {
                "text": "false",
                "kind": "text"
              }
            ]
          }
        }
      },
      {
        "kind": "Output",
        "name": "thyLoadingEvent",
        "aliasName": "",
        "type": {
          "name": "EventEmitter<boolean>",
          "options": null
        },
        "description": "Loading Event",
        "default": "",
        "tags": {}
      },
      {
        "kind": "ContentChild",
        "name": "templateRef",
        "aliasName": "template",
        "type": {
          "name": "TemplateRef<unknown>",
          "options": null,
          "kindName": "TypeReference"
        },
        "description": "",
        "default": "",
        "tags": {}
      }
    ]
  } 
]
```


## NgParserHost

```ts
import { NgDocParser, createNgParserHost } from '@docgeni/ngdoc';

const ngParserHost = createNgParserHost({
    tsConfigPath: '/lib/src/tsconfig.json',
    rootDir: '/lib/src',
    watch: true,
    watcher: (event, filename) => {}
});

const ngParser = NgDocParser.create({
    ngParserHost: ngParserHost
});

const docs = ngParser.parse(__dirname + '/button/*.ts');
console.log(JSON.stringify(docs, null, 2));
```

createNgParserHost Options:

- tsConfigPath: the abs path of tsconfig
- rootDir: component source root dir
- watch?: whether watch all source files change
- watcher?: event changed when watch is true
