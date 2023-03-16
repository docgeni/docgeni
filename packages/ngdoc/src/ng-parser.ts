import { ts } from './typescript';
import { toolkit, debug } from '@docgeni/toolkit';
import {
    NgDirectiveDoc,
    NgPropertyDoc,
    NgEntryItemDoc,
    NgDocItemType,
    NgParsedDecorator,
    NgMethodDoc,
    NgServiceDoc,
    ClassLikeDoc
} from './types';
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
    declarationIsPublic,
    hasPrivateTag,
    DocTagResult,
    getTextByJSDocTagInfo,
    hasPublicTag
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

    public getSourceFiles(fileGlobs: string) {
        const filePaths = toolkit.fs.globSync(fileGlobs);
        debug(`fileGlobs: ${fileGlobs}, filePaths: ${filePaths.length}`, 'ng-parser');
        const sourceFiles = filePaths
            .map(filePath => {
                const finalPath = ts.sys.useCaseSensitiveFileNames ? filePath : filePath.toLowerCase();
                const sourceFile = this.ngParserHost.program.getSourceFileByPath(finalPath as ts.Path);
                if (!sourceFile) {
                    debug(`getSourceFileByPath(${finalPath}) is null, origin: ${filePath}`, 'ng-parser');
                }
                return sourceFile;
            })
            .filter(sourceFile => {
                return typeof sourceFile !== 'undefined' && !sourceFile.isDeclarationFile;
            });
        return sourceFiles;
    }

    public parse(fileGlobs: string): NgEntryItemDoc[] {
        const sourceFiles = this.getSourceFiles(fileGlobs);
        debug(`fileGlobs: ${fileGlobs}, sourceFiles: ${sourceFiles.length}`, 'ng-parser');
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
            debug(`sourceFile: ${sourceFile.fileName}, exportSymbols: ${exportSymbols.length}`, 'ng-parser');
            exportSymbols.forEach(symbol => {
                let declaration = symbol.valueDeclaration;
                if (!declaration && symbol.getDeclarations()) {
                    declaration = symbol.getDeclarations()[0];
                }
                if (parsedSymbols.get(symbol) || !declaration) {
                    return;
                }
                // getExportsOfModule 对于同一个 symbol 可能会导出多次
                parsedSymbols.set(symbol, true);
                if (ts.isClassDeclaration(declaration)) {
                    const ngDecorator = getNgDecorator(declaration);
                    if (ngDecorator) {
                        const type = getNgDocItemType(ngDecorator.name);
                        const tags = getDocTagsBySymbol(symbol);
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
                                    break;
                                default:
                                    throw new Error(`${type} is not support.`);
                            }
                        }
                    } else {
                        const tags = getDocTagsBySymbol(symbol);
                        if (hasPublicTag(tags)) {
                            docs.push(this.parseClassLikeDoc(context, symbol, declaration, tags));
                        }
                    }
                } else if (ts.isInterfaceDeclaration(declaration)) {
                    const tags = getDocTagsBySymbol(symbol);
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
        const tags = getDocTagsBySymbol(symbol);
        const directiveDoc: NgServiceDoc = {
            type: 'service',
            name: description.name,
            description: getTextByJSDocTagInfo(tags.description, description.comment),
            order: tags.order ? parseInt(getTextByJSDocTagInfo(tags.order, ''), 10) : Number.MAX_SAFE_INTEGER
        };
        directiveDoc.properties = this.parseDeclarationProperties(context, symbol.valueDeclaration as ts.ClassDeclaration);
        directiveDoc.methods = this.parseDeclarationMethods(context, symbol.valueDeclaration as ts.ClassDeclaration);
        return directiveDoc;
    }

    private parseDirectiveDoc(
        context: ParserSourceFileContext,
        type: NgDocItemType,
        symbol: ts.Symbol,
        ngDecorator: NgParsedDecorator,
        tags: DocTagResult
    ) {
        const description = serializeSymbol(symbol, context.checker);
        const directiveDoc: NgDirectiveDoc = {
            type: type,
            name: getTextByJSDocTagInfo(tags.name, description.name),
            className: description.name,
            description: description.comment,
            order: tags.order ? parseInt(getTextByJSDocTagInfo(tags.order, ''), 10) : Number.MAX_SAFE_INTEGER,
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
                    if (!hasPrivateTag(tags)) {
                        const property: NgPropertyDoc = {
                            kind: propertyKind,
                            name: symbolDescription.name,
                            aliasName: this.getNgPropertyAliasName(decorator),
                            type: {
                                name: getTextByJSDocTagInfo(tags.type, symbolDescription.type),
                                options: options,
                                kindName: ts.SyntaxKind[propertyDeclaration.type?.kind]
                            },
                            description: getTextByJSDocTagInfo(tags.description, symbolDescription.comment),
                            default: '',
                            tags: tags
                        };

                        if (propertyKind === 'Input') {
                            property.default =
                                ts.displayPartsToString(tags.default?.text) ||
                                getPropertyValue(propertyDeclaration, symbolDescription.type);
                        }
                        properties.push(property);
                    }
                }
            }
        });
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
                    const tags = getDocTagsBySymbol(symbol);
                    const property: NgPropertyDoc = {
                        name: symbolDescription.name,
                        type: {
                            name: symbolDescription.type,
                            options: options,
                            kindName: ts.SyntaxKind[propertyDeclaration.type?.kind]
                        },
                        description: ts.displayPartsToString(tags.description?.text) || symbolDescription.comment,
                        default: '',
                        tags: tags
                    };
                    property.default =
                        ts.displayPartsToString(tags.default?.text) || getPropertyValue(propertyDeclaration, symbolDescription.type);
                    properties.push(property);
                }
            }
        });
        return properties;
    }

    private parseDeclarationMethods(context: ParserSourceFileContext, classDeclaration: ts.ClassDeclaration) {
        const methods: NgPropertyDoc[] = [];
        ts.forEachChild(classDeclaration, (node: ts.Node) => {
            if (ts.isMethodDeclaration(node) && declarationIsPublic(node)) {
                const symbol = context.checker.getSymbolAtLocation(node.name);
                if (symbol && node.body) {
                    const type = context.checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
                    const symbolDescription = serializeSymbol(symbol, context.checker);
                    const list = context.checker.getSignaturesOfType(type, ts.SignatureKind.Call).map(signature => {
                        const tags = getDocTagsBySignature(signature);
                        const descriptionText = ts.displayPartsToString(tags.description?.text);
                        const defaultDocumentationText = ts.displayPartsToString(signature.getDocumentationComment(context.checker));
                        return ({
                            name: symbolDescription.name,
                            parameters: signature.parameters.map(parameter =>
                                serializeMethodParameterSymbol(parameter, context.checker, tags)
                            ),
                            returnValue: { type: context.checker.typeToString(signature.getReturnType()), description: tags.return?.text },
                            description: descriptionText || defaultDocumentationText
                        } as unknown) as NgMethodDoc;
                    });

                    methods.push(...list);
                }
            }
        });
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
            description: getTextByJSDocTagInfo(tags.description, description.comment),
            order: tags.order ? parseInt(getTextByJSDocTagInfo(tags.order, ''), 10) : Number.MAX_SAFE_INTEGER
        };
        doc.properties = this.parseDeclarationProperties(context, declaration);
        doc.methods = this.parseDeclarationMethods(context, declaration as ts.ClassDeclaration);
        return doc;
    }

    private getNgPropertyAliasName(decorator: NgParsedDecorator): string {
        if (decorator.argumentInfo && decorator.argumentInfo[0]) {
            return decorator.argumentInfo[0] as string;
        } else {
            return '';
        }
    }
}
