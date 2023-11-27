import { toolkit } from '@docgeni/toolkit';
import * as path from 'path';
import { Project } from 'ts-morph';
import ts from 'typescript';
import { NgDocParser, NgEntryItemDoc, NgMethodDoc } from '../src';
import { createTestNgDocParser } from './testing';

const EXCLUDE_DIRS: string[] = [];
const ONLY_TEST_FIXTURE = 'full';
const ROOT_FIXTURES = path.resolve(__dirname, '../test/fixtures');

function objectContaining<T>(object: T) {
    if (toolkit.utils.isArray(object)) {
        return jasmine.arrayContaining(
            object.map(item => {
                return objectContaining(item);
            })
        );
    } else if (typeof object === 'object') {
        for (const key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
                const element = object[key];
                if (toolkit.utils.isArray(element) || typeof element === 'object') {
                    object[key] = objectContaining(element);
                }
            }
        }
        return jasmine.objectContaining((object as unknown) as {});
    } else {
        return object;
    }
}

function testAllFixtures() {
    const root = path.resolve(__dirname, '../test/fixtures');
    const dirs = toolkit.fs.readdirSync(root);
    for (const dir of dirs) {
        if (ONLY_TEST_FIXTURE && ONLY_TEST_FIXTURE !== dir) {
            continue;
        }
        if (!EXCLUDE_DIRS.includes(dir)) {
            it(`should parse success for case: ${dir}`, async () => {
                const input = path.resolve(root, `${dir}/input/*.ts`);
                const outputPath = path.resolve(root, `${dir}/output.json`);
                const output = toolkit.fs.readJSONSync(outputPath);
                // console.time('NgDocParser');
                const docs = NgDocParser.parse(input);
                // console.timeEnd('NgDocParser');
                expect(docs).toEqual(objectContaining(output));
            });
        }
    }
}

describe('ng-parser', () => {
    beforeEach(() => {});

    it('should parse component docs', () => {
        const { ngDocParser, fsHost, ngParserHost } = createTestNgDocParser('button', {
            '/button/button.component.ts': createButtonComponent(`@Input() param1: string;`)
        });
        const docs = ngDocParser.parse('/button/*');
        expect(docs).toEqual(([
            {
                type: 'component',
                name: 'ButtonComponent',
                className: 'ButtonComponent',
                description: '',
                order: 9007199254740991,
                selector: 'thy-button',
                templateUrl: null,
                template: null,
                styleUrls: null,
                styles: null,
                exportAs: null,
                standalone: false,
                properties: [
                    {
                        kind: 'Input',
                        name: 'param1',
                        aliasName: '',
                        type: {
                            name: 'string',
                            options: null,
                            kindName: 'StringKeyword'
                        },
                        description: '',
                        default: null,
                        tags: {}
                    }
                ],
                methods: []
            }
        ] as unknown) as NgEntryItemDoc[]);
    });

    it('should get default language tags', () => {
        const sourceText = `
        /**
         * thy-button description
         * @description.zh-cn 中文描述
         * @name thy-button
         * @name.zh-cn 按钮
        **/
        @Component({
            selector: 'thy-button',
            template: ''
        })
        export class ButtonComponent {
            /**
             * en description
             * @description.zh-cn 中文 description
             **/
            @Input() param1: string;
        }`;

        const { ngDocParser, fsHost, ngParserHost } = createTestNgDocParser('button', {
            '/button/button.component.ts': sourceText
        });
        const docs = ngDocParser.parse('/button/*');
        expect(docs.length).toBe(1);
        expect(docs[0].name).toBe('thy-button');
        expect(docs[0].description).toBe('thy-button description');
        const properties = docs[0].properties!;
        expect(properties.length).toBe(1);
        expect(properties[0].description).toBe('en description');
    });

    describe('directive', () => {
        it('should get heritage clauses properties', () => {
            const sourceText = `

            class Base {
                @Input() param1: string;

                @Output() param1Change: string;
            }

            @Component({
                selector: 'thy-button',
                template: ''
            })
            export class ButtonComponent extends Base {
                @Input() param2: string;
            }`;

            const { ngDocParser } = createTestNgDocParser('button', {
                '/button/button.component.ts': sourceText
            });
            const docs = ngDocParser.parse('/button/*');
            expect(docs[0].properties).toEqual([
                {
                    kind: 'Input',
                    name: 'param1',
                    aliasName: '',
                    type: {
                        name: 'string',
                        options: null,
                        kindName: 'StringKeyword'
                    },
                    description: '',
                    default: null,
                    tags: {}
                },
                {
                    kind: 'Output',
                    name: 'param1Change',
                    aliasName: '',
                    type: {
                        name: 'string',
                        options: null,
                        kindName: 'StringKeyword'
                    },
                    description: '',
                    default: '',
                    tags: {}
                },
                {
                    kind: 'Input',
                    name: 'param2',
                    aliasName: '',
                    type: {
                        name: 'string',
                        options: null,
                        kindName: 'StringKeyword'
                    },
                    description: '',
                    default: null,
                    tags: {}
                }
            ]);
        });

        it('should get recursion heritage clauses properties', () => {
            const sourceText = `

            class Base1 {
                @Input() param1: string;

                @Output() param1Change: string;
            }

            class Base2 extends Base1 {
                @Input() param2: string;
                @Output() param2Change: string;
            }

            @Component({
                selector: 'thy-button',
                template: ''
            })
            export class ButtonComponent extends Base2 {
                @Input() param3: string;
            }`;

            const { ngDocParser } = createTestNgDocParser('button', {
                '/button/button.component.ts': sourceText
            });
            const docs = ngDocParser.parse('/button/*');
            expect(docs[0].properties).toEqual([
                {
                    kind: 'Input',
                    name: 'param1',
                    aliasName: '',
                    type: { name: 'string', options: null, kindName: 'StringKeyword' },
                    description: '',
                    default: null,
                    tags: {}
                },
                {
                    kind: 'Output',
                    name: 'param1Change',
                    aliasName: '',
                    type: { name: 'string', options: null, kindName: 'StringKeyword' },
                    description: '',
                    default: '',
                    tags: {}
                },
                {
                    kind: 'Input',
                    name: 'param2',
                    aliasName: '',
                    type: { name: 'string', options: null, kindName: 'StringKeyword' },
                    description: '',
                    default: null,
                    tags: {}
                },
                {
                    kind: 'Output',
                    name: 'param2Change',
                    aliasName: '',
                    type: { name: 'string', options: null, kindName: 'StringKeyword' },
                    description: '',
                    default: '',
                    tags: {}
                },
                {
                    kind: 'Input',
                    name: 'param3',
                    aliasName: '',
                    type: { name: 'string', options: null, kindName: 'StringKeyword' },
                    description: '',
                    default: null,
                    tags: {}
                }
            ]);
        });

        it('should parse default value for boolean', () => {
            const { ngDocParser, fsHost, ngParserHost } = createTestNgDocParser('button', {
                '/button/button.component.ts': createButtonComponent(`
                @Input() param1 = false;

                @Input() param2 = true;
                `)
            });
            const docs = ngDocParser.parse('/button/*');
            expect(docs[0].properties).toEqual([
                {
                    kind: 'Input',
                    name: 'param1',
                    aliasName: '',
                    type: { name: 'boolean', options: null, kindName: undefined },
                    description: '',
                    default: false,
                    tags: {}
                },
                {
                    kind: 'Input',
                    name: 'param2',
                    aliasName: '',
                    type: { name: 'boolean', options: null, kindName: undefined },
                    description: '',
                    default: true,
                    tags: {}
                }
            ]);
        });

        it('should parse methods and properties', () => {
            const sourceText = `
            @Input() param1 = false;

            method1() {}

            /**
             * This is public method
             * @public
            **/
            method2() {}
            `;
            const { ngDocParser, fsHost, ngParserHost } = createTestNgDocParser('button', {
                '/button/button.component.ts': createButtonComponent(sourceText)
            });
            const docs = ngDocParser.parse('/button/*');
            expect(docs[0].properties).toEqual([
                {
                    kind: 'Input',
                    name: 'param1',
                    aliasName: '',
                    type: { name: 'boolean', options: null, kindName: undefined },
                    description: '',
                    default: false,
                    tags: {}
                }
            ]);
            expect(docs[0].methods).toEqual([
                {
                    name: 'method2',
                    parameters: [],
                    returnValue: { type: 'void', description: '' },
                    description: 'This is public method'
                }
            ]);
        });
    });

    describe('service', () => {
        it('should get heritage clauses properties and methods', () => {
            const sourceText = `

            class ServiceBase {
                param1: string;
                /**
                * @public
                **/
                method1() {}
            }

            @Injectable({ provideIn: 'root' })
            export class DialogService extends ServiceBase {
                param2: string
                /**
                * @public
                **/
                method2() {}
            }`;

            const { ngDocParser } = createTestNgDocParser('button', {
                '/button/button.component.ts': sourceText
            });
            const docs = ngDocParser.parse('/button/*');
            expect(docs[0].properties).toEqual([
                {
                    name: 'param1',
                    type: { name: 'string', options: null, kindName: 'StringKeyword' },
                    description: '',
                    default: null,
                    tags: {}
                },
                {
                    name: 'param2',
                    type: { name: 'string', options: null, kindName: 'StringKeyword' },
                    description: '',
                    default: null,
                    tags: {}
                }
            ]);
            expect(docs[0].methods).toEqual([
                {
                    name: 'method1',
                    parameters: [],
                    returnValue: { type: 'void', description: '' },
                    description: ''
                },
                {
                    name: 'method2',
                    parameters: [],
                    returnValue: { type: 'void', description: '' },
                    description: ''
                }
            ] as NgMethodDoc[]);
        });

        it('should get recursion heritage clauses properties and methods', () => {
            const sourceText = `

            class ServiceBase {
                param1: string;
                /**
                * @public
                **/
                method1() {}
            }

            class ServiceBase2 extends ServiceBase {
                param2: string;
                /**
                * @public
                **/
                method2() {}
            }

            @Injectable({ provideIn: 'root' })
            export class DialogService extends ServiceBase2 {
                param3: string
                /**
                * @public
                **/
                method3() {}
            }`;

            const { ngDocParser } = createTestNgDocParser('button', {
                '/button/button.component.ts': sourceText
            });
            const docs = ngDocParser.parse('/button/*');
            expect(docs[0].properties).toEqual([
                {
                    name: 'param1',
                    type: { name: 'string', options: null, kindName: 'StringKeyword' },
                    description: '',
                    default: null,
                    tags: {}
                },
                {
                    name: 'param2',
                    type: { name: 'string', options: null, kindName: 'StringKeyword' },
                    description: '',
                    default: null,
                    tags: {}
                },
                {
                    name: 'param3',
                    type: { name: 'string', options: null, kindName: 'StringKeyword' },
                    description: '',
                    default: null,
                    tags: {}
                }
            ]);
            expect(docs[0].methods).toEqual([
                {
                    name: 'method1',
                    parameters: [],
                    returnValue: { type: 'void', description: '' },
                    description: ''
                },
                {
                    name: 'method2',
                    parameters: [],
                    returnValue: { type: 'void', description: '' },
                    description: ''
                },
                {
                    name: 'method3',
                    parameters: [],
                    returnValue: { type: 'void', description: '' },
                    description: ''
                }
            ] as NgMethodDoc[]);
        });

        it('should get multiple methods for overload', () => {
            const sourceText = `
            @Injectable({ provideIn: 'root' })
            export class DialogService {
                /**
                 * method1 重载方法1
                 * @param input1 这是一个参数
                 * @memberof AlibDialog
                 */
                method1(input1: number): void;
                /**
                 * @description method1 重载方法2
                 * @param input1
                 * @param input2
                 * @memberof AlibDialog
                 */
                method1(input1: number, input2: number): void;
                method1(input1: number, input2?: number): void {}
            }`;

            const { ngDocParser } = createTestNgDocParser('dialog', {
                '/dialog/dialog.service.ts': sourceText
            });
            const docs = ngDocParser.parse('/dialog/*');
            expect(docs[0].methods).toEqual([
                {
                    name: 'method1',
                    parameters: [
                        {
                            name: 'input1',
                            description: '这是一个参数',
                            type: 'number'
                        }
                    ],
                    returnValue: {
                        type: 'void',
                        description: ''
                    },
                    description: 'method1 重载方法1'
                },
                {
                    name: 'method1',
                    parameters: [
                        {
                            name: 'input1',
                            description: '',
                            type: 'number'
                        },
                        {
                            name: 'input2',
                            description: '',
                            type: 'number'
                        }
                    ],
                    returnValue: {
                        type: 'void',
                        description: ''
                    },
                    description: 'method1 重载方法2'
                }
            ] as NgMethodDoc[]);
        });

        it('should generate service api when implements interface and param contains newline', () => {
            const sourceText = `

            interface HttpInterceptor {
                /**
                 * Identifies and handles a given HTTP request.
                 * @param req The outgoing request object to handle.
                 * @param next The next interceptor in the chain, or the backend
                 * if no interceptors remain in the chain.
                 * @returns An observable of the event stream.
                 */
                intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
            }

            @Injectable()
            export class MyHttpInterceptor implements HttpInterceptor {
                intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
                    return of(null);
                }
            }
            `;
            const { ngDocParser } = createTestNgDocParser('dialog', {
                '/dialog/dialog.service.ts': sourceText
            });
            const docs = ngDocParser.parse('/dialog/*');

            expect(docs[0].methods).toEqual([
                {
                    name: 'intercept',
                    parameters: [
                        {
                            name: 'req',
                            description: '',
                            type: 'HttpRequest<any>'
                        },
                        {
                            name: 'next',
                            description: '',
                            type: 'HttpHandler'
                        }
                    ],
                    returnValue: {
                        type: 'Observable<HttpEvent<any>>',
                        description: ''
                    },
                    description: 'Identifies and handles a given HTTP request.'
                }
            ]);
        });
    });

    describe('interface', () => {
        it('should parse interface properties and methods', () => {
            const { ngDocParser, fsHost, ngParserHost } = createTestNgDocParser('button', {
                '/dialog/dialog.ts': `
            /**
             * Dialog Config
             * @public
             **/
            export interface DialogConfig {
                /**
                 * Parm1 desc
                 **/
                parm1: string;

                /**
                 * Close dialog
                 **/
                close: (id: string) => void;
            }`
            });
            const docs = ngDocParser.parse('/dialog/*');
            expect(docs.length).toBe(1);
            expect(docs[0]).toEqual({
                type: 'interface',
                name: 'DialogConfig',
                description: 'Dialog Config',
                order: 9007199254740991,
                properties: [
                    {
                        name: 'parm1',
                        type: {
                            name: 'string',
                            options: null,
                            kindName: 'StringKeyword'
                        },
                        description: 'Parm1 desc',
                        default: null,
                        tags: {}
                    },
                    {
                        name: 'close',
                        type: {
                            name: '(id: string) => void',
                            options: null,
                            kindName: 'FunctionType'
                        },
                        description: 'Close dialog',
                        default: null,
                        tags: {}
                    }
                ],
                methods: []
            });
        });

        it('should get heritage clauses interface', () => {
            const sourceText = `

            interface Base {
                param1: string;
            }

            /**
             * @public
             **/
            export interface ButtonConfig extends Base {
                param2: string;
            }`;

            const { ngDocParser } = createTestNgDocParser('button', {
                '/button/button.component.ts': sourceText
            });
            const docs = ngDocParser.parse('/button/*');
            expect(docs[0].properties).toEqual([
                {
                    name: 'param1',
                    type: {
                        name: 'string',
                        options: null,
                        kindName: 'StringKeyword'
                    },
                    description: '',
                    default: null,
                    tags: {}
                },
                {
                    name: 'param2',
                    type: {
                        name: 'string',
                        options: null,
                        kindName: 'StringKeyword'
                    },
                    description: '',
                    default: null,
                    tags: {}
                }
            ]);
        });

        it('should get heritage clauses interfaces', () => {
            const sourceText = `

            interface Base1 {
                param1: string;
            }

            interface Base2 {
                param2: string;
            }

            /**
             * @public
             **/
            export interface ButtonConfig extends Base2, Base1 {
                param3: string;
            }`;

            const { ngDocParser } = createTestNgDocParser('button', {
                '/button/button.component.ts': sourceText
            });
            const docs = ngDocParser.parse('/button/*');
            expect(docs[0].properties).toEqual([
                {
                    name: 'param1',
                    type: {
                        name: 'string',
                        options: null,
                        kindName: 'StringKeyword'
                    },
                    description: '',
                    default: null,
                    tags: {}
                },
                {
                    name: 'param2',
                    type: {
                        name: 'string',
                        options: null,
                        kindName: 'StringKeyword'
                    },
                    description: '',
                    default: null,
                    tags: {}
                },
                {
                    name: 'param3',
                    type: {
                        name: 'string',
                        options: null,
                        kindName: 'StringKeyword'
                    },
                    description: '',
                    default: null,
                    tags: {}
                }
            ]);
        });

        it('should get recursion heritage clauses interface', () => {
            const sourceText = `

            interface Base1 {
                param1: string;
            }

            interface Base2 extends Base1 {
                param2: string;
            }

            /**
             * @public
             **/
            export interface ButtonConfig extends Base2 {
                param3: string;
            }`;

            const { ngDocParser } = createTestNgDocParser('button', {
                '/button/button.component.ts': sourceText
            });
            const docs = ngDocParser.parse('/button/*');
            expect(docs[0].properties).toEqual([
                {
                    name: 'param1',
                    type: {
                        name: 'string',
                        options: null,
                        kindName: 'StringKeyword'
                    },
                    description: '',
                    default: null,
                    tags: {}
                },
                {
                    name: 'param2',
                    type: {
                        name: 'string',
                        options: null,
                        kindName: 'StringKeyword'
                    },
                    description: '',
                    default: null,
                    tags: {}
                },
                {
                    name: 'param3',
                    type: {
                        name: 'string',
                        options: null,
                        kindName: 'StringKeyword'
                    },
                    description: '',
                    default: null,
                    tags: {}
                }
            ]);
        });
    });

    describe('class', () => {
        it('should parse class properties and methods', () => {
            const { ngDocParser, fsHost, ngParserHost } = createTestNgDocParser('button', {
                '/dialog/dialog.ts': `
            /**
             * Dialog Ref
             * @public
             **/
            export class DialogRef {
                /**
                 * Parm1 desc
                 **/
                parm1: string;

                /**
                 * Close dialog
                 **/
                close(id?: string): void {}
            }`
            });
            const docs = ngDocParser.parse('/dialog/*');
            expect(docs.length).toBe(1);
            expect(docs[0]).toEqual({
                type: 'class',
                name: 'DialogRef',
                description: 'Dialog Ref',
                order: 9007199254740991,
                properties: [
                    {
                        name: 'parm1',
                        type: {
                            name: 'string',
                            options: null,
                            kindName: 'StringKeyword'
                        },
                        description: 'Parm1 desc',
                        default: null,
                        tags: {}
                    }
                ],
                methods: [
                    {
                        name: 'close',
                        parameters: [
                            {
                                name: 'id',
                                description: '',
                                type: 'string'
                            }
                        ],
                        returnValue: {
                            type: 'void',
                            description: ''
                        },
                        description: 'Close dialog'
                    }
                ]
            });
        });

        it('should parse heritage clauses class properties and methods', () => {
            const sourceText = `
 /**
 * AbstractDialogRef
 */
export abstract class AbstractDialogRef<T> {
    /**
     * Parm1 desc
     */
    parm1: string;

    parm1Method() {}

    /**
     * 模态框打开后的回调
     */
    abstract afterOpened(): Observable<void>;
}
/**
 * Dialog Ref
 * @public
 */
export abstract class DialogRef<T = unknown> extends AbstractDialogRef<T> {
    /**
     * Parm2 desc
     */
    parm2: string;

    /**
     * Close dialog
     */
    close(id?: string): void {}
}`;
            const { ngDocParser, fsHost, ngParserHost } = createTestNgDocParser('button', {
                '/dialog/dialog.ts': sourceText
            });
            const docs = ngDocParser.parse('/dialog/*');
            expect(docs.length).toBe(1);
            expect(docs[0]).toEqual({
                type: 'class',
                name: 'DialogRef',
                description: 'Dialog Ref',
                order: 9007199254740991,
                properties: [
                    {
                        name: 'parm1',
                        type: {
                            name: 'string',
                            options: null,
                            kindName: 'StringKeyword'
                        },
                        description: 'Parm1 desc',
                        default: null,
                        tags: {}
                    },
                    {
                        name: 'parm2',
                        type: {
                            name: 'string',
                            options: null,
                            kindName: 'StringKeyword'
                        },
                        description: 'Parm2 desc',
                        default: null,
                        tags: {}
                    }
                ],
                methods: [
                    {
                        name: 'parm1Method',
                        parameters: [],
                        returnValue: {
                            type: 'void',
                            description: ''
                        },
                        description: ''
                    },
                    {
                        name: 'afterOpened',
                        parameters: [],
                        returnValue: {
                            type: 'Observable<void>',
                            description: ''
                        },
                        description: '模态框打开后的回调'
                    },
                    {
                        name: 'close',
                        parameters: [
                            {
                                name: 'id',
                                description: '',
                                type: 'string'
                            }
                        ],
                        returnValue: {
                            type: 'void',
                            description: ''
                        },
                        description: 'Close dialog'
                    }
                ]
            });
        });
    });

    describe('pipe', () => {
        it('should parse pipe methods', () => {
            const { ngDocParser } = createTestNgDocParser('button', {
                '/dialog/dialog.ts': `
                /**
                 * 把文本转换成全大写形式
                 * @public
                 * @name uppercase
                 * @order 10
                 */
                @Pipe({
                    name: 'uppercase',
                    standalone: true
                })
                export class UpperCasePipe implements PipeTransform {
                    constructor() {}
                
                    /**
                     * @public
                     * @param {string} value 输入值
                     * @returns  {boolean}
                     */
                    transform(value: string): boolean {                   
                        return true;
                    }
                }`
            });
            const docs = ngDocParser.parse('/dialog/*');
            expect(docs.length).toBe(1);
            expect(docs[0]).toEqual({
                type: 'pipe',
                name: 'uppercase',
                description: '把文本转换成全大写形式',
                order: 10,
                pure: true,
                standalone: true,
                methods: [
                    {
                        name: 'transform',
                        parameters: [
                            {
                                name: 'value',
                                description: '输入值',
                                type: 'string'
                            }
                        ],
                        returnValue: {
                            type: 'boolean',
                            description: ''
                        },
                        description: ''
                    }
                ]
            });
        });

        it('should get multiple methods for overload', () => {
            const sourceText = `
            @Pipe({
                name: 'lowercase',
                standalone: true
            })
            export class LowerCasePipe implements PipeTransform {
                constructor() {}
            
                /**
                 * @public
                 * @description transform 重载方法1
                 * @param input1 这是一个参数
                 */
                transform(input1: number): void;
                /**
                 * @description transform 重载方法2
                 * @param input1
                 * @param input2
                 */
                transform(input1: number, input2: number): void;
                transform(input1: number, input2?: number): void {}
            }`;

            const { ngDocParser } = createTestNgDocParser('dialog', {
                '/dialog/dialog.ts': sourceText
            });
            const docs = ngDocParser.parse('/dialog/*');
            expect(docs[0].methods).toEqual([
                {
                    name: 'transform',
                    parameters: [
                        {
                            name: 'input1',
                            description: '这是一个参数',
                            type: 'number'
                        }
                    ],
                    returnValue: {
                        type: 'void',
                        description: ''
                    },
                    description: 'transform 重载方法1'
                },
                {
                    name: 'transform',
                    parameters: [
                        {
                            name: 'input1',
                            description: '',
                            type: 'number'
                        },
                        {
                            name: 'input2',
                            description: '',
                            type: 'number'
                        }
                    ],
                    returnValue: {
                        type: 'void',
                        description: ''
                    },
                    description: 'transform 重载方法2'
                }
            ] as NgMethodDoc[]);
        });
    });
});

function createButtonComponent(body: string = '') {
    return `
    @Component({
        selector: 'thy-button',
        template: ''
    })
    export class ButtonComponent {
        ${body}
    }`;
}

describe('#parser', () => {
    testAllFixtures();

    xit('perf compare', () => {
        const input = path.resolve(ROOT_FIXTURES, `full/input/*.ts`);
        const filePaths = toolkit.fs.globSync(input);
        console.time('createProgram');
        const program = ts.createProgram(filePaths, { skipLibCheck: true, skipDefaultLibCheck: true }, undefined, undefined, []);
        console.timeEnd('createProgram');

        console.time('createProgram1');
        const program1 = ts.createProgram(filePaths, { skipLibCheck: true, skipDefaultLibCheck: true }, undefined);
        console.timeEnd('createProgram1');

        console.time('createProgram2');
        const options: ts.CompilerOptions = {};
        const host: ts.CompilerHost = {
            fileExists: filePath => {
                return toolkit.fs.pathExistsSync(filePath);
            },
            directoryExists: dirPath => dirPath === '/',
            getCurrentDirectory: () => '/',
            getDirectories: () => [],
            getCanonicalFileName: fileName => fileName,
            getNewLine: () => '\n',
            getDefaultLibFileName: () => '',
            getSourceFile: filePath => {
                const text = toolkit.fs.readFileSync(filePath, { encoding: 'utf-8' });
                return ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest);
            },
            readFile: filePath => {
                return toolkit.fs.readFileSync(filePath, { encoding: 'utf-8' });
            },
            useCaseSensitiveFileNames: () => true,
            writeFile: () => {}
        };
        const program2 = ts.createProgram({
            options,
            rootNames: filePaths,
            host: host
        });
        console.timeEnd('createProgram2');

        console.time('tsMorph');
        const project = new Project({});
        project.addSourceFilesAtPaths(input);
        const d111 = project.getProgram().compilerObject; //.getTypeChecker().compilerObject;
        console.timeEnd('tsMorph');

        console.time('tsMorph1');
        const project1 = new Project({});
        project1.addSourceFilesAtPaths(input);
        const d1 = project1.getProgram().compilerObject; //.getTypeChecker().compilerObject;
        project1.addSourceFilesAtPaths(path.resolve(ROOT_FIXTURES, `property-ref-enum/input/*.ts`));
        const d11 = project1.getProgram().compilerObject;
        console.timeEnd('tsMorph1');
    });

    xit('parse TETHYS', () => {
        const tethysRootPath = '/Users/haifeng/IT/10_YC/Worktile/ngx-tethys';
        const dirs = toolkit.fs.globSync(`${tethysRootPath}/src/*`);
        console.time('TETHYS');
        const ngDocParser = new NgDocParser({ fileGlobs: `${tethysRootPath}/src/*/{*[!spec].ts,!(examples|api|test)/**/*[!spec].ts}` });
        let total = 0;
        dirs.forEach(dir => {
            if (toolkit.fs.isDirectory(dir)) {
                const docs = NgDocParser.parse(`${dir}/{*[!spec].ts,!(examples|api|test)/**/*[!spec].ts}`);
                total += docs.length;
            }
        });
        // console.log(JSON.stringify(docs, null, 2));
        console.log(`generate docs: ${total}`);
        console.timeEnd('TETHYS');
    });
});
