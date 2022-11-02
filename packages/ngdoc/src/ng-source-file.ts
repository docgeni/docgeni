import { toolkit } from '@docgeni/toolkit';
import { ArgumentInfo, NgComponentMetadata, NgModuleInfo } from './types';
import {
    findNodes,
    getDirectiveMeta,
    getNgDecorator,
    getNodeText,
    getObjectLiteralExpressionProperties,
    isExported,
    isExportedClassDeclaration
} from './parser';
import { ts } from './typescript';
import { lineFeedPrinter } from './parser/line-feed-printer';

export interface ImportDeclarationStructure {
    moduleSpecifier?: string;
    namedImports?: { name: string }[];
}

export class NgSourceFile {
    private sourceFile: ts.SourceFile;

    public get origin() {
        return this.sourceFile;
    }

    public get length() {
        return this.getFullText().length;
    }

    constructor(sourceFile: ts.SourceFile);
    constructor(filePath: string, sourceText: string);
    constructor(filePathOrSourceFile: string | ts.SourceFile, sourceText?: string) {
        if (toolkit.utils.isString(filePathOrSourceFile)) {
            this.sourceFile = ts.createSourceFile(filePathOrSourceFile, sourceText, ts.ScriptTarget.Latest, true);
        } else {
            this.sourceFile = filePathOrSourceFile;
        }
    }

    public getFullText() {
        return this.origin.getFullText();
    }

    public getExportedComponents(): NgComponentMetadata[] {
        const components: NgComponentMetadata[] = [];
        const classDeclarations = findNodes<ts.ClassDeclaration>(this.sourceFile, isExportedClassDeclaration);
        classDeclarations.forEach(classDeclaration => {
            const ngDecorator = getNgDecorator(classDeclaration, ['Component']);
            if (ngDecorator) {
                components.push({
                    name: classDeclaration.name.getText(),
                    ...getDirectiveMeta(ngDecorator.argumentInfo)
                });
            }
        });
        return components;
    }

    public getExpectExportedComponent(keywords?: string): NgComponentMetadata {
        const components = this.getExportedComponents();
        if (components) {
            if (keywords) {
                const normalizedKeywords = toolkit.strings.camelCase(keywords).toLowerCase();
                const component = components.find(component => {
                    return component.name.toLowerCase().includes(normalizedKeywords);
                });
                return component;
            } else {
                return components[0];
            }
        } else {
            return undefined;
        }
    }

    public getExportedNgModule(): NgModuleInfo {
        let ngModule: NgModuleInfo = null;
        ts.forEachChild(this.sourceFile, node => {
            if (isExportedClassDeclaration(node)) {
                const ngDecorator = getNgDecorator(node, ['NgModule']);
                if (ngDecorator) {
                    ngModule = {
                        name: node.name.getText()
                    };
                }
            }
        });
        return ngModule;
    }

    public getDefaultExports<TResult>(): TResult {
        let exports: TResult;
        ts.forEachChild(this.sourceFile, node => {
            if (ts.isExportAssignment(node) && ts.isObjectLiteralExpression(node.expression)) {
                exports = getObjectLiteralExpressionProperties(node.expression);
            }
        });
        return (exports as unknown) as TResult;
    }

    public getDefaultExportNode(): ts.Node {
        let result: ts.Node;
        ts.forEachChild(this.sourceFile, node => {
            if (ts.isExportAssignment(node) && ts.isObjectLiteralExpression(node.expression)) {
                result = node;
            }
        });
        return result;
    }

    public getImportDeclarations(): ts.ImportDeclaration[] {
        return findNodes(this.sourceFile, ts.SyntaxKind.ImportDeclaration) as ts.ImportDeclaration[];
    }
}

export function createNgSourceFile(sourceFile: ts.SourceFile): NgSourceFile;
export function createNgSourceFile(filePath: string, sourceText?: string): NgSourceFile;
export function createNgSourceFile(filePathOrSourceFile?: string | ts.SourceFile, sourceText?: string): NgSourceFile {
    if (toolkit.utils.isString(filePathOrSourceFile)) {
        let finalSourceText = sourceText;
        if (sourceText === undefined || sourceText === null) {
            finalSourceText = toolkit.fs.readFileSync(filePathOrSourceFile, { encoding: 'utf-8' });
        }
        return new NgSourceFile(filePathOrSourceFile, finalSourceText);
    } else {
        return new NgSourceFile(filePathOrSourceFile);
    }
}
