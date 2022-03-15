import { createNgSourceFile, NgSourceFile } from './ng-source-file';
import path from 'path';
import { Project, Node, ts, SourceFile, ExportAssignment, ImportDeclaration } from 'ts-morph';
import { getCallExpressionInfo, getObjectLiteralExpressionProperties } from './parser';
import { lineFeedPrinter } from './parser/line-feed-printer';
import { ArgumentInfo } from './types';

describe('#ng-source-file', () => {
    it('should create ng source file success by sourceText', () => {
        const ngSourceFile = createNgSourceFile('test.ts', `sourceText`);
        expect(ngSourceFile).toBeTruthy();
        expect(ngSourceFile.origin).toBeTruthy();
    });

    it('should create ng source file success by filePath', () => {
        const ngSourceFile = createNgSourceFile(path.resolve(__dirname, '../test/fixtures/full/input/button.component.ts'));
        expect(ngSourceFile).toBeTruthy();
        expect(ngSourceFile.origin).toBeTruthy();
    });

    it('should get exported components', () => {
        const sourceText = `
        export class NotComponent {}

        @Component({selector: "internal-component"})
        class InternalComponent {}

        @Component({selector: "my-component"})
        export class MyComponent {}
        `;
        const ngSourceFile = createNgSourceFile('test.ts', sourceText);
        expect(ngSourceFile.getExportedComponents()).toEqual([jasmine.objectContaining({ name: 'MyComponent', selector: 'my-component' })]);
    });

    it('should get exported ngModule', () => {
        const sourceText = `
        @NgModule({declarations: []})
        export class AppModule {}
        `;
        const ngSourceFile = createNgSourceFile('test.ts', sourceText);
        expect(ngSourceFile.getExportedNgModule()).toEqual(jasmine.objectContaining({ name: 'AppModule' }));
    });

    it('should get default exports', () => {
        const sourceText = `
        import { CommonModule } from "@angular/common"
        export default { providers: [], imports: [CommonModule] } {}
        `;
        const ngSourceFile = createNgSourceFile('test.ts', sourceText);
        const defaultExports = ngSourceFile.getDefaultExports();
        expect(defaultExports).toEqual({ providers: [], imports: ['CommonModule'] });
    });

    it('should get undefined default exports', () => {
        const sourceText = `
        export const book = { providers: [], imports: [] }
        `;
        const ngSourceFile = createNgSourceFile('test.ts', sourceText);
        const defaultExports = ngSourceFile.getDefaultExports();
        expect(defaultExports).toEqual(undefined);
    });

    xit('should generate example module source success by ts-morph', () => {
        console.time('tsMorph');
        const sourceText = `
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

export default {
    imports: [ CommonModule ]
};
        `;
        for (let index = 0; index < 100; index++) {
            const sourceFile = createSourceFile('text.ts', sourceText);
            generateExampleModuleSourceByMorph(sourceFile, 'MyModule', [
                { name: 'AlibComponent', moduleSpecifier: './basic.component.ts' },
                { name: 'AlibButtonComponent', moduleSpecifier: './basic.component.ts' },
                { name: 'AlibButtonAdvanceComponent', moduleSpecifier: './advance.component.ts' },
                { name: 'AlibButtonAdvance1Component', moduleSpecifier: './advance1.component.ts' },
                { name: 'AlibButtonAdvance2Component', moduleSpecifier: './advance2.component.ts' },
                { name: 'AlibButtonAdvance3Component', moduleSpecifier: './advance3.component.ts' },
                { name: 'AlibButtonAdvance4Component', moduleSpecifier: './advance4.component.ts' },
                { name: 'AlibButtonAdvance5Component', moduleSpecifier: './advance5.component.ts' },
                { name: 'AlibButtonAdvance6Component', moduleSpecifier: './advance6.component.ts' },
                { name: 'AlibButtonAdvance7Component', moduleSpecifier: './advance7.component.ts' },
                { name: 'AlibButtonAdvance8Component', moduleSpecifier: './advance8.component.ts' },
                { name: 'AlibButtonAdvance9Component', moduleSpecifier: './advance9.component.ts' },
                { name: 'AlibButtonAdvance10Component', moduleSpecifier: './advance10.component.ts' }
            ]);
            // console.log(sourceFile.getText());
        }

        console.timeEnd('tsMorph');
    });

    function generateExampleModuleSourceByMorph(
        sourceFile: SourceFile,
        moduleName: string,
        components: { name: string; moduleSpecifier: string }[]
    ) {
        const exportAssignment = sourceFile.getExportAssignment(node => {
            return Node.isObjectLiteralExpression(node.getExpression());
        });
        let expressionProperties: {
            declarations: string[];
            exports: string[];
            imports: string[];
        } = {} as any;
        let ngModuleInsertIndex = 0;
        if (exportAssignment) {
            const expression = exportAssignment.getExpression();
            expressionProperties = getObjectLiteralExpressionProperties(expression.compilerNode as any) as {
                declarations: string[];
                exports: string[];
                imports: string[];
            };
            expressionProperties.declarations = expressionProperties.declarations || [];
            expressionProperties.declarations = [...expressionProperties.declarations, ...components.map(item => item.name)];
            expressionProperties.exports = expressionProperties.declarations;
            ngModuleInsertIndex = exportAssignment.getChildIndex() + 1;
        } else {
            ngModuleInsertIndex = sourceFile.getChildren()[0].getChildren().length;
            const declarations = components.map(item => {
                return item.name;
            });
            expressionProperties = {
                declarations: declarations,
                exports: declarations,
                imports: []
            };
        }
        const str = Object.keys(expressionProperties)
            .map(key => {
                return `${key}: [ ${expressionProperties[key].join(', ')} ]`;
            })
            .join(', ');

        sourceFile.insertClass(ngModuleInsertIndex, {
            name: moduleName,
            isExported: true,
            decorators: [
                {
                    name: 'NgModule',
                    arguments: [`{ ${str} }`]
                }
            ]
        });
        const imports = [{ name: 'NgModule', moduleSpecifier: '@angular/core' }, ...components];

        const importDeclarations = sourceFile.getImportDeclarations();
        const moduleSpecifiersMap = importDeclarations.reduce<Record<string, ImportDeclaration>>((result, item) => {
            result[item.getModuleSpecifier().getLiteralValue()] = item;
            return result;
        }, {});
        const insertImportDeclarations = new Map<string, string[]>();
        imports.forEach(importItem => {
            if (moduleSpecifiersMap[importItem.moduleSpecifier]) {
                const namedImports = moduleSpecifiersMap[importItem.moduleSpecifier].getNamedImports();
                const hasNamedImport = namedImports.find(namedImport => {
                    return namedImport.getName() === importItem.name;
                });
                if (!hasNamedImport) {
                    moduleSpecifiersMap[importItem.moduleSpecifier].addNamedImport(importItem.name);
                }
            } else {
                if (insertImportDeclarations.get(importItem.moduleSpecifier)) {
                    insertImportDeclarations.get(importItem.moduleSpecifier).push(importItem.name);
                } else {
                    insertImportDeclarations.set(importItem.moduleSpecifier, [importItem.name]);
                }
            }
        });
        sourceFile.insertImportDeclarations(
            0,
            Array.from(insertImportDeclarations.entries()).map(([key, items]) => {
                return {
                    moduleSpecifier: key,
                    namedImports: items
                };
            })
        );
    }

    function createSourceFile(filePath: string, sourceText: string) {
        const project = new Project({});
        return project.createSourceFile(filePath, sourceText);
    }
});
