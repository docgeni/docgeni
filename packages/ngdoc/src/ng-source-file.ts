import { toolkit } from '@docgeni/toolkit';
import { ArgumentInfo, NgComponentMetadata, NgModuleInfo } from './types';
import {
    findNodes,
    getDirectiveMeta,
    getNgDecorator,
    getNodeText,
    getObjectLiteralExpressionProperties,
    isExported,
    isExportedClassDeclaration,
} from './parser';
import { ts } from './typescript';
import { lineFeedPrinter } from './parser/line-feed-printer';

export interface FlatImportStructure {
    name: string;
    moduleSpecifier: string;
}

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
            this.sourceFile = ts.createSourceFile(filePathOrSourceFile as string, sourceText!, ts.ScriptTarget.Latest, true);
        } else {
            this.sourceFile = filePathOrSourceFile as ts.SourceFile;
        }
    }

    public getFullText() {
        return this.origin.getFullText();
    }

    public getExportedComponents(): NgComponentMetadata[] {
        const components: NgComponentMetadata[] = [];
        const classDeclarations = findNodes<ts.ClassDeclaration>(this.sourceFile, isExportedClassDeclaration);
        classDeclarations.forEach((classDeclaration) => {
            const ngDecorator = getNgDecorator(classDeclaration, ['Component']);
            if (ngDecorator) {
                components.push({
                    name: classDeclaration.name.getText(),
                    ...getDirectiveMeta(ngDecorator.argumentInfo),
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
                const component = components.find((component) => {
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
        ts.forEachChild(this.sourceFile, (node) => {
            if (isExportedClassDeclaration(node)) {
                const ngDecorator = getNgDecorator(node, ['NgModule']);
                if (ngDecorator) {
                    ngModule = {
                        name: node.name.getText(),
                    };
                }
            }
        });
        return ngModule;
    }

    public getDefaultExports<TResult>(): TResult {
        let exports: ArgumentInfo;
        ts.forEachChild(this.sourceFile, (node) => {
            if (ts.isExportAssignment(node) && ts.isObjectLiteralExpression(node.expression)) {
                exports = getObjectLiteralExpressionProperties(node.expression);
            }
        });
        return exports as unknown as TResult;
    }

    public getDefaultExportNode(): ts.Node {
        let result: ts.Node;
        ts.forEachChild(this.sourceFile, (node) => {
            if (ts.isExportAssignment(node) && ts.isObjectLiteralExpression(node.expression)) {
                result = node;
            }
        });
        return result;
    }

    public getImportDeclarations(): ts.ImportDeclaration[] {
        return findNodes(this.sourceFile, ts.SyntaxKind.ImportDeclaration) as ts.ImportDeclaration[];
    }

    public getImportStructures(): FlatImportStructure[] {
        const structures: FlatImportStructure[] = [];
        this.getImportDeclarations().forEach((importDeclaration) => {
            const moduleSpecifier = getNodeText(importDeclaration.moduleSpecifier).replace(/['"]/g, '');
            if (importDeclaration.importClause?.namedBindings && ts.isNamedImports(importDeclaration.importClause.namedBindings)) {
                importDeclaration.importClause.namedBindings.elements.forEach((element) => {
                    structures.push({ name: element.name.text, moduleSpecifier });
                });
            } else if (importDeclaration.importClause?.name) {
                structures.push({ name: importDeclaration.importClause.name.text, moduleSpecifier });
            }
        });
        return structures;
    }

    public getExportedConstMetadata(constName: string): ArgumentInfo {
        const initializer = this.getExportedConstInitializer(constName);
        return initializer ? getObjectLiteralExpressionProperties(initializer) : {};
    }

    public getExportedConstArrayLiteral(constName: string, propertyName: string): ts.ArrayLiteralExpression | undefined {
        const initializer = this.getExportedConstInitializer(constName);
        if (!initializer) {
            return undefined;
        }
        const property = initializer.properties.find((item) => {
            return ts.isPropertyAssignment(item) && item.name.getText() === propertyName;
        }) as ts.PropertyAssignment | undefined;
        if (property?.initializer && ts.isArrayLiteralExpression(property.initializer)) {
            return property.initializer;
        }
        return undefined;
    }

    private getExportedConstInitializer(constName: string): ts.ObjectLiteralExpression | undefined {
        let initializer: ts.ObjectLiteralExpression | undefined;
        ts.forEachChild(this.sourceFile, (node) => {
            if (!ts.isVariableStatement(node) || !isExported(node)) {
                return;
            }
            const declaration = node.declarationList.declarations[0];
            if (
                declaration &&
                ts.isIdentifier(declaration.name) &&
                declaration.name.text === constName &&
                declaration.initializer &&
                ts.isObjectLiteralExpression(declaration.initializer)
            ) {
                initializer = declaration.initializer;
            }
        });
        return initializer;
    }
}

export function createNgSourceFile(sourceFile: ts.SourceFile): NgSourceFile;
export function createNgSourceFile(filePath: string, sourceText?: string): NgSourceFile;
export function createNgSourceFile(filePathOrSourceFile?: string | ts.SourceFile, sourceText?: string): NgSourceFile {
    if (toolkit.utils.isString(filePathOrSourceFile)) {
        let finalSourceText = sourceText;
        if (sourceText === undefined || sourceText === null) {
            finalSourceText = toolkit.fs.readFileSync(filePathOrSourceFile as string, { encoding: 'utf-8' });
        }
        return new NgSourceFile(filePathOrSourceFile as string, finalSourceText);
    } else {
        return new NgSourceFile(filePathOrSourceFile as ts.SourceFile);
    }
}
