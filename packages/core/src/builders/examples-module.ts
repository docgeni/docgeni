import { NgSourceFile } from '@docgeni/ngdoc';
import { generateComponentsModule, getNgModuleMetadataFromDefaultExport, combineNgModuleMetaData } from '../ast-utils';
import { NgModuleMetadata } from '../types/module';

export async function generateComponentExamplesModule(
    sourceFile: NgSourceFile,
    ngModuleName: string,
    components: { name: string; moduleSpecifier: string }[]
) {
    const declarations = components.map(item => item.name);
    const defaultModuleMetadata = getNgModuleMetadataFromDefaultExport(sourceFile);
    const moduleMetadata: NgModuleMetadata = combineNgModuleMetaData(defaultModuleMetadata, {
        imports: ['CommonModule'],
        declarations: [...declarations],
        entryComponents: [...declarations],
        exports: [...declarations]
    });
    const ngModuleText = generateNgModuleText(ngModuleName, moduleMetadata);

    const module = generateComponentsModule(sourceFile, ngModuleText, [
        ...components,
        { name: 'CommonModule', moduleSpecifier: '@angular/common' },
        { name: 'NgModule', moduleSpecifier: '@angular/core' }
    ]);
    return module;
}

function generateNgModuleText(ngModuleName: string, moduleMetadata: NgModuleMetadata) {
    const moduleMetadataArgs = Object.keys(moduleMetadata)
        .map(key => {
            return `${key}: [ ${moduleMetadata[key].join(', ')} ]`;
        })
        .join(',\n    ');
    return `
@NgModule({
    ${moduleMetadataArgs}
})
export class ${ngModuleName} {}
`;
}
