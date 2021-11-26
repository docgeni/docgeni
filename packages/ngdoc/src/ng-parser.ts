import { ts } from './typescript';
import { toolkit } from '@docgeni/toolkit';
import { NgDirectiveDoc, NgPropertyDoc, NgEntryItemDoc, NgDocItemType, NgParsedDecorator, NgDirectiveMeta, NgComponentInfo } from './types';
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
import { createNgSourceFile } from './ng-source-file';

export interface NgDocParserOptions {
    fileGlobs: string;
    compilerHost?: ts.CompilerHost;
}

export interface ParserSourceFileContext {
    sourceFile: ts.SourceFile;
    program: ts.Program;
    checker: ts.TypeChecker;
}

export class NgDocParser {
    static parse(pattern: string) {
        return new NgDocParser({ fileGlobs: pattern }).parse(pattern);
    }

    static getExportedComponents(sourceText: string): NgComponentInfo[] {
        return createNgSourceFile(sourceText).getExportedComponents();
    }

    private tsProgram: ts.Program;

    constructor(private options?: NgDocParserOptions) {}

    private get program() {
        if (!this.tsProgram) {
            const filePaths = toolkit.fs.globSync(this.options.fileGlobs);
            this.tsProgram = ts.createProgram(filePaths, { types: [] }, this.options.compilerHost || this.createCompilerHost());
        }
        return this.tsProgram;
    }

    public getSourceFiles(fileGlob: string) {
        const filePaths = toolkit.fs.globSync(fileGlob);
        const sourceFiles = filePaths
            .map(filePath => {
                return this.program.getSourceFileByPath(filePath.toLowerCase() as ts.Path);
            })
            .filter(sourceFile => {
                return typeof sourceFile !== 'undefined' && !sourceFile.isDeclarationFile;
            });
        return sourceFiles;
    }

    public parse(pattern: string) {
        const sourceFiles = this.getSourceFiles(pattern);
        const checker = this.program.getTypeChecker();

        const docs: NgEntryItemDoc[] = [];
        sourceFiles.forEach(sourceFile => {
            const context: ParserSourceFileContext = {
                sourceFile: sourceFile,
                program: this.program,
                checker: checker
            };
            const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
            if (!moduleSymbol) {
                return;
            }
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
                        jsDocTags: symbol.getJsDocTags() as any
                    });
                }
            }
        });
        return properties;
    }

    private createCompilerHost(): ts.CompilerHost {
        const host = ts.createCompilerHost({});
        // host.directoryExists = dirPath => {
        //     return dirPath.startsWith(ts.sys.getCurrentDirectory());
        // };
        host.getDefaultLibFileName = () => '';
        return host;
    }
}
