import { debug, fs, toolkit } from '@docgeni/toolkit';
import { NgParserHost, createNgParserHost } from './ng-parser-host';
import {
    DocTagResult,
    declarationIsPublic,
    getCallExpressionInfo,
    getDirectiveMeta,
    getDocTagsBySignature,
    getDocTagsBySymbol,
    getHeritageDeclarations,
    getNgDecorator,
    getNgDocItemType,
    getNgPropertyDecorator,
    getNgPropertyOptions,
    getPipeMeta,
    getPropertyKind,
    getPropertyValue,
    getSymbolDeclaration,
    getTextByJSDocTagInfo,
    hasPrivateTag,
    hasPublicTag,
    serializeMethodParameterSymbol,
    serializeSymbol,
} from './parser';
import {
    ClassLikeDoc,
    NgDirectiveDoc,
    NgDocItemType,
    NgEntryItemDoc,
    NgMethodDoc,
    NgParsedDecorator,
    NgPipeDoc,
    NgPropertyDoc,
    NgServiceDoc,
} from './types';
import { ts } from './typescript';

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

    public getSourceFiles(fileGlobs: string, options?: fs.GetDirsOrFilesOptions) {
        const filePaths = toolkit.fs.globSync(fileGlobs, options);
        debug(`fileGlobs: ${fileGlobs}, filePaths: ${filePaths.length}`, 'ng-parser');
        const sourceFiles = filePaths
            .map((filePath) => {
                const finalPath = ts.sys.useCaseSensitiveFileNames ? filePath : filePath.toLowerCase();
                const sourceFile = this.ngParserHost.program.getSourceFileByPath(finalPath as ts.Path);
                if (!sourceFile) {
                    debug(`getSourceFileByPath(${finalPath}) is null, origin: ${filePath}`, 'ng-parser');
                }
                return sourceFile;
            })
            .filter((sourceFile) => {
                return typeof sourceFile !== 'undefined' && !sourceFile.isDeclarationFile;
            });
        return sourceFiles;
    }

    public parse(fileGlobs: string, options?: fs.GetDirsOrFilesOptions): NgEntryItemDoc[] {
        const sourceFiles = this.getSourceFiles(fileGlobs, options);
        debug(`fileGlobs: ${fileGlobs}, sourceFiles: ${sourceFiles.length}`, 'ng-parser');
        const checker = this.ngParserHost.program.getTypeChecker();

        const docs: NgEntryItemDoc[] = [];
        const parsedSymbols = new Map<ts.Symbol, boolean>();
        sourceFiles.forEach((sourceFile) => {
            const context: ParserSourceFileContext = {
                sourceFile: sourceFile,
                program: this.ngParserHost.program,
                checker: checker,
            };
            const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
            if (!moduleSymbol) {
                return;
            }

            const exportSymbols = checker.getExportsOfModule(moduleSymbol);
            debug(`sourceFile: ${sourceFile.fileName}, exportSymbols: ${exportSymbols.length}`, 'ng-parser');
            exportSymbols.forEach((symbol) => {
                const declaration = getSymbolDeclaration(symbol);
                if (parsedSymbols.get(symbol) || !declaration) {
                    return;
                }
                // getExportsOfModule 对于同一个 symbol 可能会导出多次
                parsedSymbols.set(symbol, true);
                if (ts.isClassDeclaration(declaration)) {
                    const ngDecorator = getNgDecorator(declaration);
                    if (ngDecorator) {
                        const type = getNgDocItemType(ngDecorator.name);
                        const [tags, localeTags] = getDocTagsBySymbol(symbol);
                        if (!hasPrivateTag(tags)) {
                            switch (type) {
                                case 'component':
                                case 'directive':
                                    docs.push(this.parseDirectiveDoc(context, type, symbol, ngDecorator, tags));
                                    break;
                                case 'service':
                                    docs.push(this.parseServiceDoc(context, symbol, ngDecorator));
                                    break;
                                case 'pipe':
                                    docs.push(this.parsePipeDoc(context, symbol, ngDecorator));
                                    break;
                                default:
                                    throw new Error(`${type} is not support.`);
                            }
                        }
                    } else {
                        const [tags, localeTags] = getDocTagsBySymbol(symbol);
                        if (hasPublicTag(tags)) {
                            docs.push(this.parseClassLikeDoc(context, symbol, declaration, tags));
                        }
                    }
                } else if (ts.isInterfaceDeclaration(declaration)) {
                    const [tags, localeTags] = getDocTagsBySymbol(symbol);
                    if (hasPublicTag(tags)) {
                        docs.push(this.parseClassLikeDoc(context, symbol, declaration, tags));
                    }
                }
            });
        });
        return toolkit.utils.sortByOrder(docs);
    }

    private parseServiceDoc(context: ParserSourceFileContext, symbol: ts.Symbol, ngDecorator: NgParsedDecorator) {
        const description = serializeSymbol(symbol, context.checker);
        const [tags, localeTags] = getDocTagsBySymbol(symbol);
        const directiveDoc: NgServiceDoc = {
            type: 'service',
            name: description.name,
            description: getTextByJSDocTagInfo(tags.description, description.description || ''),
            order: tags.order ? parseInt(getTextByJSDocTagInfo(tags.order, ''), 10) : Number.MAX_SAFE_INTEGER,
        };
        directiveDoc.properties = this.parseDeclarationProperties(context, symbol.valueDeclaration as ts.ClassDeclaration);
        directiveDoc.methods = this.parseDeclarationMethods(context, symbol.valueDeclaration as ts.ClassDeclaration);
        return directiveDoc;
    }

    private parsePipeDoc(context: ParserSourceFileContext, symbol: ts.Symbol, ngDecorator: NgParsedDecorator) {
        const declaration = symbol.valueDeclaration as ts.ClassDeclaration;
        const description = serializeSymbol(symbol, context.checker);
        const [tags, localeTags] = getDocTagsBySymbol(symbol);
        const directiveDoc: NgPipeDoc = {
            type: 'pipe',
            description: description.description,
            order: tags.order ? parseInt(getTextByJSDocTagInfo(tags.order, ''), 10) : Number.MAX_SAFE_INTEGER,
            ...getPipeMeta(ngDecorator.argumentInfo),
            name: getTextByJSDocTagInfo(tags.name, getPipeMeta(ngDecorator.argumentInfo)?.name),
        };
        directiveDoc.methods = this.parseDeclarationMethods(context, declaration);
        return directiveDoc;
    }

    private parseDirectiveDoc(
        context: ParserSourceFileContext,
        type: NgDocItemType,
        symbol: ts.Symbol,
        ngDecorator: NgParsedDecorator,
        tags: DocTagResult,
    ) {
        const declaration = symbol.valueDeclaration as ts.ClassDeclaration;
        const description = serializeSymbol(symbol, context.checker);
        const directiveDoc: NgDirectiveDoc = {
            type: type,
            name: getTextByJSDocTagInfo(tags.name, description.name),
            className: description.name,
            description: description.description,
            order: tags.order ? parseInt(getTextByJSDocTagInfo(tags.order, ''), 10) : Number.MAX_SAFE_INTEGER,
            ...getDirectiveMeta(ngDecorator.argumentInfo),
        };
        directiveDoc.properties = this.parseDirectiveProperties(context, declaration);
        directiveDoc.methods = this.parseDeclarationMethods(context, declaration, { explicitPublic: true });
        return directiveDoc;
    }

    private parseDirectiveProperties(context: ParserSourceFileContext, classDeclaration: ts.ClassDeclaration) {
        const properties: NgPropertyDoc[] = [];
        ts.forEachChild(classDeclaration, (node: ts.Node) => {
            if (ts.isPropertyDeclaration(node) || ts.isSetAccessor(node)) {
                const symbol = context.checker.getSymbolAtLocation(node.name);
                const decorator = getNgPropertyDecorator(node);
                const signalApis = ['model', 'input', 'output'];

                if (symbol) {
                    const propertyDeclaration = symbol.valueDeclaration as ts.PropertyDeclaration;
                    const symbolDescription = serializeSymbol(symbol, context.checker);
                    const options = getNgPropertyOptions(propertyDeclaration, context.checker);
                    const [tags, localeTags] = getDocTagsBySymbol(symbol);
                    if (!hasPrivateTag(tags)) {
                        const property: NgPropertyDoc = {
                            name: symbolDescription.name,
                            type: {
                                name: getTextByJSDocTagInfo(tags.type, symbolDescription.type),
                                options: options,
                                kindName: ts.SyntaxKind[propertyDeclaration.type?.kind],
                            },
                            description: getTextByJSDocTagInfo(tags.description, symbolDescription.description),
                            default: '',
                            tags: tags,
                        };
                        if (decorator) {
                            const propertyKind = getPropertyKind(decorator.name);
                            property.kind = propertyKind;
                            property.aliasName = this.getNgPropertyAliasName(decorator);
                            if (propertyKind === 'Input') {
                                property.default =
                                    ts.displayPartsToString(tags.default?.text) ||
                                    getPropertyValue(propertyDeclaration, symbolDescription.type);
                            }
                            properties.push(property);
                        } else {
                            let callInfo = null;
                            if (propertyDeclaration.initializer?.kind === ts.SyntaxKind.CallExpression) {
                                callInfo = getCallExpressionInfo(propertyDeclaration.initializer as ts.CallExpression);
                            }

                            if (signalApis.includes(callInfo?.name)) {
                                property.kind = callInfo.name === 'output' ? 'Output' : 'Input';
                                if ((callInfo?.argumentInfo[1] as { alias: string })?.alias) {
                                    property.aliasName = (callInfo?.argumentInfo[1] as { alias: string }).alias;
                                } else {
                                    property.aliasName = '';
                                }
                                if (callInfo.name === 'input') {
                                    property.default = ts.displayPartsToString(tags.default?.text) || callInfo?.argumentInfo[0];
                                }
                                properties.push(property);
                            }
                        }
                    }
                }
            }
        });
        const heritageDeclarations = getHeritageDeclarations(classDeclaration, context.checker);
        if (heritageDeclarations && heritageDeclarations.length > 0) {
            heritageDeclarations.forEach((declaration) => {
                properties.unshift(...this.parseDirectiveProperties(context, declaration as ts.ClassDeclaration));
            });
        }

        return properties;
    }

    private parseDeclarationProperties(context: ParserSourceFileContext, declaration: ts.Declaration) {
        const properties: NgPropertyDoc[] = [];
        ts.forEachChild(declaration, (node: ts.Node) => {
            if ((ts.isPropertyDeclaration(node) || ts.isSetAccessor(node) || ts.isPropertySignature(node)) && declarationIsPublic(node)) {
                const symbol = context.checker.getSymbolAtLocation(node.name);
                if (symbol) {
                    const propertyDeclaration = symbol.valueDeclaration as ts.PropertyDeclaration;
                    const symbolDescription = serializeSymbol(symbol, context.checker);
                    const options = getNgPropertyOptions(propertyDeclaration, context.checker);
                    const [tags, localeTags] = getDocTagsBySymbol(symbol);
                    const property: NgPropertyDoc = {
                        name: symbolDescription.name,
                        type: {
                            name: symbolDescription.type,
                            options: options,
                            kindName: ts.SyntaxKind[propertyDeclaration.type?.kind],
                        },
                        description: ts.displayPartsToString(tags.description?.text) || symbolDescription.description,
                        default:
                            ts.displayPartsToString(tags.default?.text) || getPropertyValue(propertyDeclaration, symbolDescription.type),
                        tags: tags,
                    };
                    properties.push(property);
                }
            }
        });
        const heritageDeclarations = getHeritageDeclarations(declaration, context.checker);
        if (heritageDeclarations && heritageDeclarations.length) {
            heritageDeclarations.forEach((declaration) => {
                properties.unshift(...this.parseDeclarationProperties(context, declaration as ts.ClassDeclaration));
            });
        }
        return properties;
    }

    private parseDeclarationMethods(
        context: ParserSourceFileContext,
        classDeclaration: ts.ClassDeclaration,
        options: { explicitPublic: boolean } = { explicitPublic: false },
    ) {
        const methods: NgMethodDoc[] = [];
        const parsedSymbols = new WeakMap<ts.Symbol, boolean>();
        ts.forEachChild(classDeclaration, (node: ts.Node) => {
            if (ts.isMethodDeclaration(node) && declarationIsPublic(node)) {
                const symbol = context.checker.getSymbolAtLocation(node.name);

                // 显示公开的函数才会添加
                if (options && options.explicitPublic) {
                    const [tags] = getDocTagsBySymbol(symbol);
                    if (!hasPublicTag(tags)) {
                        return;
                    }
                }

                if (symbol && !parsedSymbols.has(symbol)) {
                    parsedSymbols.set(symbol, true);
                    const type = context.checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
                    const symbolDescription = serializeSymbol(symbol, context.checker);
                    const signatures = context.checker.getSignaturesOfType(type, ts.SignatureKind.Call);
                    const methodSignatures = signatures.map((signature) => {
                        const tags = getDocTagsBySignature(signature);
                        const descriptionText = ts.displayPartsToString(tags.description?.text);
                        const defaultDocumentationText = ts.displayPartsToString(signature.getDocumentationComment(context.checker));
                        return {
                            name: symbolDescription.name,
                            parameters: signature.parameters.map((parameter) =>
                                serializeMethodParameterSymbol(parameter, context.checker, tags),
                            ),
                            returnValue: {
                                type: context.checker.typeToString(signature.getReturnType()),
                                description: tags.return?.text || '',
                            },
                            description: descriptionText || defaultDocumentationText || '',
                        } as unknown as NgMethodDoc;
                    });
                    methods.push(...methodSignatures);
                }
            }
        });
        const heritageDeclarations = getHeritageDeclarations(classDeclaration, context.checker);
        if (heritageDeclarations && heritageDeclarations.length) {
            heritageDeclarations.forEach((declaration) => {
                methods.unshift(...this.parseDeclarationMethods(context, declaration as ts.ClassDeclaration, options));
            });
        }
        return methods;
    }

    /**
     * parse interface or class doc
     */
    private parseClassLikeDoc(context: ParserSourceFileContext, symbol: ts.Symbol, declaration: ts.Declaration, tags: DocTagResult) {
        const description = serializeSymbol(symbol, context.checker);
        const doc: ClassLikeDoc = {
            type: ts.isInterfaceDeclaration(declaration) ? 'interface' : 'class',
            name: description.name,
            description: getTextByJSDocTagInfo(tags.description, description.description),
            order: tags.order ? parseInt(getTextByJSDocTagInfo(tags.order, ''), 10) : Number.MAX_SAFE_INTEGER,
        };
        doc.properties = this.parseDeclarationProperties(context, declaration);
        doc.methods = this.parseDeclarationMethods(context, declaration as ts.ClassDeclaration);
        return doc;
    }

    private getNgPropertyAliasName(decorator: NgParsedDecorator): string {
        if (decorator.argumentInfo && decorator.argumentInfo[0]) {
            const argumentInfo = decorator.argumentInfo[0];
            if (typeof argumentInfo === 'object') {
                if ((argumentInfo as { alias: string }).alias) {
                    return (argumentInfo as { alias: string }).alias;
                } else {
                    return '';
                }
            } else {
                return decorator.argumentInfo[0] as string;
            }
        } else {
            return '';
        }
    }
}
