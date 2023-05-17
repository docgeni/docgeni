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

    describe('insertImports', () => {
        it('should return changes when sourceFile has import and importStructures is []', () => {
            const ngSourceFile = createNgSourceFile('module.ts', sourceText);
            const changes = utils.insertImports(ngSourceFile, []);
            expect(changes.length).toBe(0);
            expect(changes).toEqual([]);
        });

        it('should return changes when sourceFile is null and importStructures is []', () => {
            const ngSourceFile = createNgSourceFile('module.ts', '');
            const changes = utils.insertImports(ngSourceFile, []);
            expect(changes.length).toBe(0);
            expect(changes).toEqual([]);
        });

        it('should return changes when has sourceFile import and importStructures has value', () => {
            const ngSourceFile = createNgSourceFile('module.ts', sourceText);
            const changes = utils.insertImports(ngSourceFile, [
                {
                    name: 'FormsModule',
                    moduleSpecifier: '@angular/forms'
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
                new InsertChange(ngSourceFile.origin.fileName, pos, `\nimport { FormsModule } from '@angular/forms';`),
                new InsertChange(ngSourceFile.origin.fileName, pos, `\nimport { TestComponent } from './test.component';`)
            ]);
        });

        it('should return changes when sourceFile has`t import and importStructures has value', () => {
            const ngSourceFile = createNgSourceFile('module.ts', '');
            const changes = utils.insertImports(ngSourceFile, [
                {
                    name: 'FormsModule',
                    moduleSpecifier: '@angular/forms'
                },
                {
                    name: 'TestComponent',
                    moduleSpecifier: './test.component'
                }
            ]);
            expect(changes.length).toBe(2);

            expect(changes).toEqual([
                new InsertChange(ngSourceFile.origin.fileName, 0, `import { FormsModule } from '@angular/forms';`),
                new InsertChange(ngSourceFile.origin.fileName, 0, `\nimport { TestComponent } from './test.component';`)
            ]);
        });

        it('should return changes when sourceFile has import and importStructures has duplicate value', () => {
            const ngSourceFile = createNgSourceFile('module.ts', sourceText);
            const changes = utils.insertImports(ngSourceFile, [
                {
                    name: 'CommonModule',
                    moduleSpecifier: '@angular/common'
                },
                {
                    name: 'TestComponent',
                    moduleSpecifier: './test.component'
                }
            ]);
            expect(changes.length).toBe(1);
            const allImports = ngSourceFile.getImportDeclarations();
            const pos = allImports[allImports.length - 1].getEnd();
            expect(changes).toEqual([
                new InsertChange(ngSourceFile.origin.fileName, pos, `\nimport { TestComponent } from './test.component';`)
            ]);
        });

        it('should return changes when sourceFile has import and has same path in importStructures', () => {
            const ngSourceFile = createNgSourceFile('module.ts', sourceText);
            const changes = utils.insertImports(ngSourceFile, [
                {
                    name: 'registerLocaleData',
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
                new InsertChange(ngSourceFile.origin.fileName, 26, `, registerLocaleData`),
                new InsertChange(ngSourceFile.origin.fileName, pos, `\nimport { TestComponent } from './test.component';`)
            ]);
        });
    });

    describe('combineNgModuleMetadata', () => {
        it('when metadata and append has value', () => {
            const combinedMetadata = utils.combineNgModuleMetadata(
                { imports: ['FormsModule'], providers: ['AppService'], bootstrap: ['RootComponent'] },
                { imports: ['CommonModule'], declarations: ['AppComponent'] }
            );
            expect(combinedMetadata).toEqual({
                declarations: ['AppComponent'],
                providers: ['AppService'],
                imports: ['FormsModule', 'CommonModule'],
                exports: [],
                bootstrap: ['RootComponent']
            });
        });

        it('when metadata and append has duplicate value', () => {
            const combinedMetadata = utils.combineNgModuleMetadata(
                { imports: ['CommonModule', 'FormsModule'], providers: ['AppService'] },
                { imports: ['CommonModule'], declarations: ['AppComponent'] }
            );
            expect(combinedMetadata).toEqual({
                declarations: ['AppComponent'],
                providers: ['AppService'],
                imports: ['CommonModule', 'FormsModule'],
                exports: []
            });
        });

        it('when append has`t value', () => {
            const combinedMetadata = utils.combineNgModuleMetadata({ imports: ['FormsModule'], providers: ['AppService'] }, {});
            expect(combinedMetadata).toEqual({
                declarations: [],
                providers: ['AppService'],
                imports: ['FormsModule'],
                exports: []
            });
        });

        it('when metadata has`t value', () => {
            const combinedMetadata = utils.combineNgModuleMetadata({}, { imports: ['FormsModule'], providers: ['AppService'] });
            expect(combinedMetadata).toEqual({
                declarations: [],
                providers: ['AppService'],
                imports: ['FormsModule'],
                exports: []
            });
        });

        it('when metadata and append have not value', () => {
            const combinedMetadata = utils.combineNgModuleMetadata({}, {});
            expect(combinedMetadata).toEqual({
                declarations: [],
                providers: [],
                imports: [],
                exports: []
            });
        });

        it('should get undefined when bootstrap metadata is empty', () => {
            const combinedMetadata = utils.combineNgModuleMetadata(
                { imports: ['FormsModule'], providers: ['AppService'] },
                { imports: ['CommonModule'], declarations: ['AppComponent'] }
            );
            expect(combinedMetadata.bootstrap).toEqual(undefined);
        });

        it('should get bootstrap when append bootstrap metadata has value', () => {
            const combinedMetadata = utils.combineNgModuleMetadata(
                { imports: ['FormsModule'], providers: ['AppService'] },
                { imports: ['CommonModule'], declarations: ['AppComponent'], bootstrap: ['RootComponent'] }
            );
            expect(combinedMetadata.bootstrap).toEqual(['RootComponent']);
        });
    });

    describe('getNgModuleMetadataFromDefaultExport', () => {
        it('should return default metadata when has export default', () => {
            const ngSourceFile = createNgSourceFile('module.ts', sourceText);
            const defaultModuleMetadata = utils.getNgModuleMetadataFromDefaultExport(ngSourceFile);
            expect(defaultModuleMetadata).toEqual({ imports: ['CommonModule'], declarations: ['AppComponent'], providers: ['AppService'] });
        });

        it('should return default metadata when has`t export default', () => {
            const ngSourceFile = createNgSourceFile('module.ts', '');
            const defaultModuleMetadata = utils.getNgModuleMetadataFromDefaultExport(ngSourceFile);
            expect(defaultModuleMetadata).toEqual({});
        });
    });
});
