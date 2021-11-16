import ts from 'typescript';
import { toolkit } from '@docgeni/toolkit';
import { NgDirectiveDoc, NgPropertyDoc, NgEntryItemDoc, NgDocItemType, NgParsedDecorator, NgDirectiveMeta } from './types';
import {
    getNgDecorator,
    getPropertyDecorator,
    getDirectiveMeta,
    getNgDocItemType,
    getPropertyKind,
    getNgPropertyOptions,
    getPropertyValue,
    serializeSymbol
} from './parser';

export interface NgDocParserOptions {}

export interface ParserSourceFileContext {
    sourceFile: ts.SourceFile;
    program: ts.Program;
    checker: ts.TypeChecker;
}

export interface NgComponentInfo extends NgDirectiveMeta {
    name: string;
}

export class NgDocParser {
    static parse(pattern: string) {
        return new NgDocParser().parse(pattern);
    }

    static getExportsComponents(source: string): NgComponentInfo[] {
        return new NgDocParser().getExportsComponents(source);
    }

    constructor(private options?: NgDocParserOptions) {}

    public parse(pattern: string) {
        const filePaths = toolkit.fs.globSync(pattern);
        const program = ts.createProgram(filePaths, {});
        const checker = program.getTypeChecker();
        const sourceFiles = program.getSourceFiles().filter(sourceFile => {
            return !sourceFile.isDeclarationFile && typeof sourceFile !== 'undefined';
        });

        const docs: NgEntryItemDoc[] = [];
        sourceFiles.forEach(sourceFile => {
            const context: ParserSourceFileContext = {
                sourceFile: sourceFile,
                program: program,
                checker: checker
            };
            const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
            const exportSymbols = checker.getExportsOfModule(moduleSymbol);
            exportSymbols.forEach(symbol => {
                if (symbol.valueDeclaration && ts.isClassDeclaration(symbol.valueDeclaration)) {
                    const ngDecorator = getNgDecorator(symbol.valueDeclaration);
                    if (ngDecorator) {
                        const type = getNgDocItemType(ngDecorator.name);
                        const tags = symbol.getJsDocTags();
                        const isPrivate = tags.find(tag => tag.name === 'private');
                        if (!isPrivate) {
                            switch (type) {
                                case 'component':
                                case 'directive':
                                    docs.push(this.parseDirectiveDoc(context, type, symbol, ngDecorator));
                                    break;
                                case 'service':
                                    this.parseServiceDoc(context, symbol, ngDecorator);
                                    break;
                                default:
                                    throw new Error(`${type} is not support}`);
                            }
                        }
                    }
                }
            });
        });
        return docs;
    }

    public getExportsComponents(source: string): NgComponentInfo[] {
        const sourceFile = ts.createSourceFile('test.ts', source, ts.ScriptTarget.Latest, true);

        const components: NgComponentInfo[] = [];
        ts.forEachChild(sourceFile, node => {
            if (ts.isClassDeclaration(node)) {
                const hasExport = node.modifiers
                    ? node.modifiers.find(modifier => {
                          return ts.SyntaxKind.ExportKeyword === modifier.kind;
                      })
                    : false;
                if (hasExport) {
                    const ngDecorator = getNgDecorator(node);
                    if (ngDecorator && ngDecorator.name === 'Component') {
                        components.push({
                            name: (node as ts.ClassDeclaration)!.name.getText(),
                            ...getDirectiveMeta(ngDecorator.argumentInfo)
                        });
                    }
                }
            }
        });
        return components;
    }

    private parseServiceDoc(context: ParserSourceFileContext, symbol: ts.Symbol, ngDecorator: NgParsedDecorator) {}

    private parseDirectiveDoc(context: ParserSourceFileContext, type: NgDocItemType, symbol: ts.Symbol, ngDecorator: NgParsedDecorator) {
        const description = serializeSymbol(symbol, context.checker);
        const directiveDoc: NgDirectiveDoc = {
            type: type,
            name: description.name,
            description: description.documentation,
            ...getDirectiveMeta(ngDecorator.argumentInfo)
        };
        directiveDoc.properties = this.parseDirectiveProperties(context, symbol.valueDeclaration as ts.ClassDeclaration);
        return directiveDoc;
    }

    private parseDirectiveProperties(context: ParserSourceFileContext, classDeclaration: ts.ClassDeclaration) {
        const properties: NgPropertyDoc[] = [];
        ts.forEachChild(classDeclaration, (node: ts.Node) => {
            if (ts.isPropertyDeclaration(node)) {
                const symbol = context.checker.getSymbolAtLocation(node.name);
                const decorator = getPropertyDecorator(node);
                if (symbol && decorator) {
                    const propertyDeclaration = symbol.valueDeclaration as ts.PropertyDeclaration;
                    const description = serializeSymbol(symbol, context.checker);
                    const options = getNgPropertyOptions(propertyDeclaration, context.checker);
                    properties.push({
                        kind: getPropertyKind(decorator.name),
                        name: description.name,
                        type: description.type,
                        description: description.documentation,
                        options: options,
                        default: getPropertyValue(propertyDeclaration, description.type),
                        jsDocTags: symbol.getJsDocTags()
                    });
                }
            }
        });
        return properties;
    }
}
