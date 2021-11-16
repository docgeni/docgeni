import { toolkit } from '@docgeni/toolkit';
import { NgComponentInfo } from './types';
import { getDirectiveMeta, getNgDecorator, isExported } from './parser';
import { ts } from './typescript';

export class NgSourceFile {
    private sourceFile: ts.SourceFile;

    public get origin() {
        return this.sourceFile;
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

    public getExportedComponents(): NgComponentInfo[] {
        const components: NgComponentInfo[] = [];
        ts.forEachChild(this.sourceFile, node => {
            if (ts.isClassDeclaration(node)) {
                if (isExported(node)) {
                    const ngDecorator = getNgDecorator(node, ['Component']);
                    if (ngDecorator) {
                        components.push({
                            name: node.name.getText(),
                            ...getDirectiveMeta(ngDecorator.argumentInfo)
                        });
                    }
                }
            }
        });
        return components;
    }

    public getExpectExportedComponent(keywords?: string): NgComponentInfo {
        const components = this.getExportedComponents();
        if (components) {
            if (keywords) {
                return components.find(component => {
                    return component.name.toLowerCase().includes(keywords.toLowerCase());
                });
            } else {
                return components[0];
            }
        } else {
            return undefined;
        }
    }

    public getNgModule() {}
}

export function createNgSourceFile(sourceFile: ts.SourceFile): NgSourceFile;
export function createNgSourceFile(filePath: string, sourceText?: string): NgSourceFile;
export function createNgSourceFile(filePathOrSourceFile?: string | ts.SourceFile, sourceText?: string): NgSourceFile {
    if (toolkit.utils.isString(filePathOrSourceFile)) {
        let finalSourceText = sourceText;
        if (!sourceText) {
            finalSourceText = toolkit.fs.readFileSync(filePathOrSourceFile, { encoding: 'utf-8' });
        }
        return new NgSourceFile(filePathOrSourceFile, finalSourceText);
    } else {
        return new NgSourceFile(filePathOrSourceFile);
    }
}
