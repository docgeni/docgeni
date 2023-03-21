import { NgDocParser, NgEntryItemDoc } from '../src';
import * as path from 'path';
import { toolkit } from '@docgeni/toolkit';
import { Project, Node } from 'ts-morph';
import ts from 'typescript';
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
                ]
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
        const properties = docs[0].properties;
        expect(properties.length).toBe(1);
        expect(properties[0].description).toBe('en description');
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
                                comment: '',
                                type: 'string'
                            }
                        ],
                        returnValue: {
                            type: 'void',
                            description: undefined
                        },
                        description: 'Close dialog'
                    }
                ]
            });
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
