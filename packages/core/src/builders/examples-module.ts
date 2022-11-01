import { NgSourceFile } from '@docgeni/ngdoc';
import { toolkit } from '@docgeni/toolkit';
import { getNgModuleMetadataFromDefaultExport, combineNgModuleMetadata, generateNgModuleText } from '../ast-utils';
import { NgSourceUpdater } from '../ng-source-updater';
import { NgModuleMetadata } from '../types/module';

export async function generateComponentExamplesModule(
    sourceFile: NgSourceFile,
    ngModuleName: string,
    components: { name: string; moduleSpecifier: string }[]
) {
    const declarations = components.map(item => item.name);
    const defaultModuleMetadata = getNgModuleMetadataFromDefaultExport(sourceFile);
    const moduleMetadata: NgModuleMetadata = combineNgModuleMetadata(defaultModuleMetadata, {
        imports: ['CommonModule'],
        declarations: [...declarations],
        entryComponents: [...declarations],
        exports: [...declarations]
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
