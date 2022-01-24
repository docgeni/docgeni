import { ts } from './typescript';
import { toolkit } from '@docgeni/toolkit';
import { NgDirectiveDoc, NgPropertyDoc, NgEntryItemDoc, NgDocItemType, NgParsedDecorator, NgMethodDoc, NgServiceDoc } from './types';
import {
    getNgDecorator,
    getNgPropertyDecorator,
    getDirectiveMeta,
    getNgDocItemType,
    getPropertyKind,
    getNgPropertyOptions,
    getPropertyValue,
    serializeSymbol,
    getDocTagsBySymbol,
    getDocTagsBySignature,
    serializeMethodParameterSymbol,
    declarationIsPublic
} from './parser';
import { createNgParserHost, NgParserHost } from './ng-parser-host';

export interface NgDocParserOptions {
    tsConfigPath?: string;
    fileGlobs?: string;
    ngParserHost?: NgParserHost;
}

export interface ParserSourceFileContext {
    sourceFile: ts.SourceFile;
    program: ts.Program;
    checker: ts.TypeChecker;
}

export class NgDocParser {
    static parse(pattern: string) {
        return this.create({ fileGlobs: pattern }).parse(pattern);
    }

    static create(options: NgDocParserOptions) {
        return new NgDocParser(options);
    }

    private ngParserHost: NgParserHost;

    constructor(private options: NgDocParserOptions) {
        this.ngParserHost = options.ngParserHost ? options.ngParserHost : createNgParserHost(options);
    }

    public getSourceFiles(fileGlob: string) {
        const filePaths = toolkit.fs.globSync(fileGlob);
        const sourceFiles = filePaths
            .map(filePath => {
                return this.ngParserHost.program.getSourceFileByPath(filePath.toLowerCase() as ts.Path);
            })
            .filter(sourceFile => {
                return typeof sourceFile !== 'undefined' && !sourceFile.isDeclarationFile;
            });
        return sourceFiles;
    }

    public parse(fileGlobs: string): NgEntryItemDoc[] {
        const sourceFiles = this.getSourceFiles(fileGlobs);
        const checker = this.ngParserHost.program.getTypeChecker();

        const docs: NgEntryItemDoc[] = [];
        const parsedSymbols = new Map<ts.Symbol, boolean>();
        sourceFiles.forEach(sourceFile => {
            const context: ParserSourceFileContext = {
                sourceFile: sourceFile,
                program: this.ngParserHost.program,
                checker: checker
            };
            const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
            if (!moduleSymbol) {
                return;
            }
            const exportSymbols = checker.getExportsOfModule(moduleSymbol);
            exportSymbols.forEach(symbol => {
                if (parsedSymbols.get(symbol)) {
                    return;
                }
                parsedSymbols.set(symbol, true);
                if (symbol.valueDeclaration && ts.isClassDeclaration(symbol.valueDeclaration)) {
                    const ngDecorator = getNgDecorator(symbol.valueDeclaration);
                    if (ngDecorator) {
                        const type = getNgDocItemType(ngDecorator.name);
                        const tags = getDocTagsBySymbol(symbol) as { private: ts.JSDocTagInfo };
                        if (!tags.private) {
                            switch (type) {
                                case 'component':
                                case 'directive':
                                    docs.push(this.parseDirectiveDoc(context, type, symbol, ngDecorator));
                                    break;
                                case 'service':
                                    docs.push(this.parseServiceDoc(context, symbol, ngDecorator));
                                    break;
                                case 'pipe':
                                    break;
                                default:
                                    throw new Error(`${type} is not support.`);
                            }
                        }
                    }
                }
            });
        });
        return docs;
    }

    private parseServiceDoc(context: ParserSourceFileContext, symbol: ts.Symbol, ngDecorator: NgParsedDecorator) {
        const description = serializeSymbol(symbol, context.checker);
        const tags = getDocTagsBySymbol(symbol);
        const directiveDoc: NgServiceDoc = {
            type: 'service',
            name: description.name,
            description: tags.description?.text || description.comment
        };
        directiveDoc.properties = this.parseServiceProperties(context, symbol.valueDeclaration as ts.ClassDeclaration);
        directiveDoc.methods = this.parseServiceMethods(context, symbol.valueDeclaration as ts.ClassDeclaration);
        return directiveDoc;
    }

    private parseDirectiveDoc(context: ParserSourceFileContext, type: NgDocItemType, symbol: ts.Symbol, ngDecorator: NgParsedDecorator) {
        const description = serializeSymbol(symbol, context.checker);
        const directiveDoc: NgDirectiveDoc = {
            type: type,
            name: description.name,
            description: description.comment,
            ...getDirectiveMeta(ngDecorator.argumentInfo)
        };
        directiveDoc.properties = this.parseDirectiveProperties(context, symbol.valueDeclaration as ts.ClassDeclaration);
        return directiveDoc;
    }

    private parseDirectiveProperties(context: ParserSourceFileContext, classDeclaration: ts.ClassDeclaration) {
        const properties: NgPropertyDoc[] = [];
        ts.forEachChild(classDeclaration, (node: ts.Node) => {
            if (ts.isPropertyDeclaration(node) || ts.isSetAccessor(node)) {
                const symbol = context.checker.getSymbolAtLocation(node.name);
                const decorator = getNgPropertyDecorator(node);
                if (symbol && decorator) {
                    const propertyDeclaration = symbol.valueDeclaration as ts.PropertyDeclaration;
                    const symbolDescription = serializeSymbol(symbol, context.checker);
                    const options = getNgPropertyOptions(propertyDeclaration, context.checker);
                    const propertyKind = getPropertyKind(decorator.name);
                    const tags = getDocTagsBySymbol(symbol);
                    const property: NgPropertyDoc = {
                        kind: propertyKind,
                        name: symbolDescription.name,
                        aliasName: this.getNgPropertyAliasName(decorator),
                        type: {
                            name: symbolDescription.type,
                            options: options,
                            kindName: ts.SyntaxKind[propertyDeclaration.type?.kind]
                        },
                        description: tags.description && tags.description.text ? tags.description.text : symbolDescription.comment,
                        default: '',
                        tags: tags
                    };

                    if (propertyKind === 'Input') {
                        property.default =
                            (tags.default && tags.default.text) || getPropertyValue(propertyDeclaration, symbolDescription.type);
                    }
                    properties.push(property);
                }
            }
        });
        return properties;
    }

    private parseServiceProperties(context: ParserSourceFileContext, classDeclaration: ts.ClassDeclaration) {
        const properties: NgPropertyDoc[] = [];
        ts.forEachChild(classDeclaration, (node: ts.Node) => {
            if ((ts.isPropertyDeclaration(node) || ts.isSetAccessor(node)) && declarationIsPublic(node)) {
                const symbol = context.checker.getSymbolAtLocation(node.name);
                if (symbol) {
                    const propertyDeclaration = symbol.valueDeclaration as ts.PropertyDeclaration;
                    const symbolDescription = serializeSymbol(symbol, context.checker);
                    const options = getNgPropertyOptions(propertyDeclaration, context.checker);
                    const tags = getDocTagsBySymbol(symbol);
                    const property: NgPropertyDoc = {
                        name: symbolDescription.name,
                        type: {
                            name: symbolDescription.type,
                            options: options,
                            kindName: ts.SyntaxKind[propertyDeclaration.type?.kind]
                        },
                        description: tags.description && tags.description.text ? tags.description.text : symbolDescription.comment,
                        default: '',
                        tags: tags
                    };

                    properties.push(property);
                }
            }
        });
        return properties;
    }

    private parseServiceMethods(context: ParserSourceFileContext, classDeclaration: ts.ClassDeclaration) {
        const properties: NgPropertyDoc[] = [];
        ts.forEachChild(classDeclaration, (node: ts.Node) => {
            if (ts.isMethodDeclaration(node) && declarationIsPublic(node)) {
                const symbol = context.checker.getSymbolAtLocation(node.name);
                if (symbol && node.body) {
                    const type = context.checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
                    const symbolDescription = serializeSymbol(symbol, context.checker);
                    const list = context.checker.getSignaturesOfType(type, ts.SignatureKind.Call).map(signature => {
                        const tags = getDocTagsBySignature(signature);
                        return {
                            name: symbolDescription.name,
                            parameters: signature.parameters.map(parameter =>
                                serializeMethodParameterSymbol(parameter, context.checker, tags)
                            ),
                            returnValue: { type: context.checker.typeToString(signature.getReturnType()), description: tags.return?.text },
                            description:
                                tags.description?.text || ts.displayPartsToString(signature.getDocumentationComment(context.checker))
                        } as NgMethodDoc;
                    });

                    properties.push(...list);
                }
            }
        });
        return properties;
    }

    private getNgPropertyAliasName(decorator: NgParsedDecorator): string {
        if (decorator.argumentInfo && decorator.argumentInfo[0]) {
            return decorator.argumentInfo[0] as string;
        } else {
            return '';
        }
    }
}
