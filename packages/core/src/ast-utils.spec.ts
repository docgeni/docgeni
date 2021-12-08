import { createNgSourceFile } from '@docgeni/ngdoc';
import { InsertChange } from '@schematics/angular/utility/change';
import { NgModuleMetadata } from './types/module';
import * as utils from './ast-utils';

describe('#ast-utils', () => {
    const sourceText = `
    import { CommonModule } from '@angular/common';
    import { AppComponent } from './app.component';

    export default {
        imports: [ CommonModule ],
        declarations: [ AppComponent ],
        providers: [ AppService ]
    };
        `;

    describe('generateComponentsModule', () => {
        const moduleMetadata: NgModuleMetadata = {
            imports: ['CommonModule'],
            declarations: ['AppComponent'],
            providers: ['AppService']
        };

        const moduleMetadataArgs = Object.keys(moduleMetadata)
            .map(key => {
                return `${key}: [ ${moduleMetadata[key].join(', ')} ]`;
            })
            .join(',\n    ');
        const ngModuleName = 'MyButtonExamplesModule';

        const moduleText = `
        @NgModule({
            ${moduleMetadataArgs}
        })
        export class ${ngModuleName} {}
        `;

        function expectOriginalSource(output: string) {
            expect(output).toMatch(`import { NgModule } from '@angular/core';`);
            expect(output).toMatch(`import { AlibComponent } from './basic.component';`);
            expect(output).toMatch(`export class MyButtonExamplesModule {}`);
            expect(output).toMatch(/declarations: \[ AppComponent \]/);
            expect(output).toMatch(/providers: \[ AppService \]/);
            expect(output).toMatch(/imports: \[ CommonModule \],/);
        }

        it('should generate module success with default export', async () => {
            const ngSourceFile = createNgSourceFile('module.ts', sourceText);

            const components = [{ name: 'AlibComponent', moduleSpecifier: './basic.component' }];
            const getModuleChangesSpy = spyOn(utils, 'getModuleChanges');
            const allImports = ngSourceFile.getImportDeclarations();
            const pos = allImports[allImports.length - 1].getEnd();
            getModuleChangesSpy.and.returnValue(
                Promise.resolve([new InsertChange(ngSourceFile.origin.fileName, pos, `\nimport { NgModule } from '@angular/core';`)])
            );
            const output = await utils.generateComponentsModule(ngSourceFile, moduleText, components);

            expectOriginalSource(output);
            expect(output).toMatch(`import { CommonModule } from '@angular/common';`);
            expect(output).toMatch(`import { AppComponent } from './app.component';`);
        });

        it('should generate module success with empty', async () => {
            const ngSourceFile = createNgSourceFile('module.ts', '');
            const components = [{ name: 'AlibComponent', moduleSpecifier: './basic.component' }];
            const output = await utils.generateComponentsModule(ngSourceFile, moduleText, components);

            expectOriginalSource(output);
        });
    });

    describe('getModuleChanges', () => {
        it('should return changes when has import', async () => {
            const ngSourceFile = createNgSourceFile('module.ts', sourceText);
            const changes = await utils.getModuleChanges(ngSourceFile, []);
            expect(changes.length).toBe(1);
            const allImports = ngSourceFile.getImportDeclarations();
            expect(changes[0]).toEqual(
                new InsertChange(
                    ngSourceFile.origin.fileName,
                    allImports[allImports.length - 1].getEnd(),
                    `\nimport { NgModule } from '@angular/core';`
                )
            );
        });

        it('should return changes when has`t import', async () => {
            const ngSourceFile = createNgSourceFile('module.ts', '');
            const changes = await utils.getModuleChanges(ngSourceFile, []);
            expect(changes.length).toBe(1);
            const allImports = ngSourceFile.getImportDeclarations();
            expect(changes[0]).toEqual(new InsertChange(ngSourceFile.origin.fileName, 0, `import { NgModule } from '@angular/core';`));
        });

        it('should return changes when has import and has components', async () => {
            const ngSourceFile = createNgSourceFile('module.ts', sourceText);
            const changes = await utils.getModuleChanges(ngSourceFile, [
                {
                    name: 'FormsModule',
                    moduleSpecifier: '@angular/forms'
                },
                {
                    name: 'TestComponent',
                    moduleSpecifier: './test.component'
                }
            ]);
            expect(changes.length).toBe(3);
            const allImports = ngSourceFile.getImportDeclarations();
            const pos = allImports[allImports.length - 1].getEnd();
            expect(changes).toEqual([
                new InsertChange(ngSourceFile.origin.fileName, pos, `\nimport { NgModule } from '@angular/core';`),
                new InsertChange(ngSourceFile.origin.fileName, pos, `\nimport { FormsModule } from '@angular/forms';`),
                new InsertChange(ngSourceFile.origin.fileName, pos, `\nimport { TestComponent } from './test.component';`)
            ]);
        });

        it('should return changes when has`t import and has components', async () => {
            const ngSourceFile = createNgSourceFile('module.ts', '');
            const changes = await utils.getModuleChanges(ngSourceFile, [
                {
                    name: 'FormsModule',
                    moduleSpecifier: '@angular/forms'
                },
                {
                    name: 'TestComponent',
                    moduleSpecifier: './test.component'
                }
            ]);
            expect(changes.length).toBe(3);
            const allImports = ngSourceFile.getImportDeclarations();

            expect(changes).toEqual([
                new InsertChange(ngSourceFile.origin.fileName, 0, `import { NgModule } from '@angular/core';`),
                new InsertChange(ngSourceFile.origin.fileName, 0, `\nimport { FormsModule } from '@angular/forms';`),
                new InsertChange(ngSourceFile.origin.fileName, 0, `\nimport { TestComponent } from './test.component';`)
            ]);
        });

        it('should return changes when has import and has duplicate value in components', async () => {
            const ngSourceFile = createNgSourceFile('module.ts', sourceText);
            const changes = await utils.getModuleChanges(ngSourceFile, [
                {
                    name: 'CommonModule',
                    moduleSpecifier: '@angular/common'
                },
                {
                    name: 'TestComponent',
                    moduleSpecifier: './test.component'
                }
            ]);
            expect(changes.length).toBe(2);
            const allImports = ngSourceFile.getImportDeclarations();
            const pos = allImports[allImports.length - 1].getEnd();
            expect(changes).toEqual([
                new InsertChange(ngSourceFile.origin.fileName, pos, `\nimport { NgModule } from '@angular/core';`),
                new InsertChange(ngSourceFile.origin.fileName, pos, `\nimport { TestComponent } from './test.component';`)
            ]);
        });

        it('should return changes when has import and has same path in components', async () => {
            const ngSourceFile = createNgSourceFile('module.ts', sourceText);
            const changes = await utils.getModuleChanges(ngSourceFile, [
                {
                    name: 'registerLocaleData',
                    moduleSpecifier: '@angular/common'
                },
                {
                    name: 'TestComponent',
                    moduleSpecifier: './test.component'
                }
            ]);
            expect(changes.length).toBe(3);
            const allImports = ngSourceFile.getImportDeclarations();
            const pos = allImports[allImports.length - 1].getEnd();
            expect(changes).toEqual([
                new InsertChange(ngSourceFile.origin.fileName, pos, `\nimport { NgModule } from '@angular/core';`),
                new InsertChange(ngSourceFile.origin.fileName, 26, `, registerLocaleData`),
                new InsertChange(ngSourceFile.origin.fileName, pos, `\nimport { TestComponent } from './test.component';`)
            ]);
        });
    });

    describe('getModuleMetaData', () => {
        it('should return moduleMetaData when has export', async () => {
            const ngSourceFile = createNgSourceFile('module.ts', sourceText);
            const metaData = await utils.getModuleMetaData(ngSourceFile, {});
            expect(metaData).toEqual({
                declarations: ['AppComponent'],
                entryComponents: [],
                providers: ['AppService'],
                imports: ['CommonModule'],
                exports: ['AppComponent']
            });
        });

        it('should return moduleMetaData when has`t export', async () => {
            const ngSourceFile = createNgSourceFile('module.ts', '');
            const metaData = await utils.getModuleMetaData(ngSourceFile, {});
            expect(metaData).toEqual({
                declarations: [],
                entryComponents: [],
                providers: [],
                imports: [],
                exports: []
            });
        });

        it('should return moduleMetaData when has export and has extraModuleMetaData', async () => {
            const ngSourceFile = createNgSourceFile('module.ts', sourceText);
            const extraModuleMetaData = {
                declarations: ['TextComponent'],
                entryComponents: ['TextComponent'],
                imports: ['FormsModule']
            };
            const metaData = await utils.getModuleMetaData(ngSourceFile, extraModuleMetaData);

            expect(metaData).toEqual({
                declarations: ['TextComponent', 'AppComponent'],
                entryComponents: ['TextComponent'],
                providers: ['AppService'],
                imports: ['FormsModule', 'CommonModule'],
                exports: ['TextComponent', 'AppComponent']
            });
        });

        it('should return moduleMetaData when has`t export and has extraModuleMetaData', async () => {
            const ngSourceFile = createNgSourceFile('module.ts', '');
            const extraModuleMetaData = {
                declarations: ['TextComponent'],
                entryComponents: ['TextComponent'],
                imports: ['FormsModule']
            };
            const metaData = await utils.getModuleMetaData(ngSourceFile, extraModuleMetaData);

            expect(metaData).toEqual({
                declarations: ['TextComponent'],
                entryComponents: ['TextComponent'],
                providers: [],
                imports: ['FormsModule'],
                exports: ['TextComponent']
            });
        });

        it('should return moduleMetaData when has export and has duplicate value in extraModuleMetaData', async () => {
            const ngSourceFile = createNgSourceFile('module.ts', sourceText);
            const extraModuleMetaData = {
                declarations: ['TextComponent', 'AppComponent'],
                entryComponents: ['TextComponent'],
                imports: ['FormsModule']
            };
            const metaData = await utils.getModuleMetaData(ngSourceFile, extraModuleMetaData);

            expect(metaData).toEqual({
                declarations: ['TextComponent', 'AppComponent'],
                entryComponents: ['TextComponent'],
                providers: ['AppService'],
                imports: ['FormsModule', 'CommonModule'],
                exports: ['TextComponent', 'AppComponent']
            });
        });
    });
});
