import ts from 'typescript';
import { toolkit } from '@docgeni/toolkit';
import { getNgDecorator, getPropertyDecorator } from './parser';
import { NgDirectiveDoc, NgPropertyDoc, NgEntryItemDoc, NgDocItemType, NgParsedDecorator } from './types';
import { getDirectiveMeta, getNgDocItemType, getPropertyKind, getPropertyOptions, getPropertyValue, serializeSymbol } from './parser/utils';

export interface NgDocParserOptions {}

export interface ParserSourceFileContext {
    sourceFile: ts.SourceFile;
    program: ts.Program;
    checker: ts.TypeChecker;
}

export class NgDocParser {
    static parse(pattern: string) {
        return new NgDocParser().parse(pattern);
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
                    const options = getPropertyOptions(propertyDeclaration);
                    properties.push({
                        kind: getPropertyKind(decorator.name),
                        name: description.name,
                        type: description.type,
                        description: description.documentation,
                        options: options,
                        jsDocTags: symbol.getJsDocTags(),
                        default: getPropertyValue(propertyDeclaration, description.type)
                    });
                }
            }
        });
        return properties;
    }
}
