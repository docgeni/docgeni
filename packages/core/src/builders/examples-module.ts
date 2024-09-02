import { NgSourceFile } from '@docgeni/ngdoc';
import { combineNgModuleMetadata, getNgModuleMetadataFromDefaultExport } from '../ast-utils';
import { NgSourceUpdater } from '../ng-source-updater';
import { NgModuleMetadata } from '../types/module';

export async function generateComponentExamplesModule(
    sourceFile: NgSourceFile,
    ngModuleName: string,
    components: { name: string; moduleSpecifier: string; standalone: boolean }[]
) {
    const declarations = components.filter(item => !item.standalone).map(item => item.name);
    const importsComponents = components.filter(item => item.standalone).map(item => item.name);
    const defaultModuleMetadata = getNgModuleMetadataFromDefaultExport(sourceFile);
    const moduleMetadata: NgModuleMetadata = combineNgModuleMetadata(defaultModuleMetadata, {
        imports: ['CommonModule', ...importsComponents],
        declarations: [...declarations],
        exports: [...declarations, ...importsComponents]
    });
    const updater = new NgSourceUpdater(sourceFile);
    updater.insertImports([
        ...components,
        { name: 'CommonModule', moduleSpecifier: '@angular/common' },
        { name: 'NgModule', moduleSpecifier: '@angular/core' }
    ]);
    updater.insertNgModule(ngModuleName, moduleMetadata);
    updater.removeDefaultExport();
    return updater.update();
}
