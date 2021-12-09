import { NgSourceFile } from '@docgeni/ngdoc';
import { generateComponentsModule, getNgModuleMetadataFromDefaultExport, combineNgModuleMetaData } from '../../ast-utils';
import { NgModuleMetadata } from '../../types/module';
import { ComponentBuilder } from './component-builder';

export async function generateBuiltInComponentsModule(sourceFile: NgSourceFile, components: Map<string, ComponentBuilder>) {
    const declarations: string[] = Array.from(components.values()).map(item => {
        return item.componentData?.name;
    });
    const defaultModuleMetadata = getNgModuleMetadataFromDefaultExport(sourceFile);
    const moduleMetadata: NgModuleMetadata = combineNgModuleMetaData(defaultModuleMetadata, {
        imports: ['CommonModule'],
        declarations: [...declarations],
        entryComponents: [...declarations],
        exports: [...declarations]
    });

    const ngModuleText = await generateNgModuleText(sourceFile, components, moduleMetadata);

    let componentsData = Array.from(components.values()).map(item => {
        return { name: item.componentData.name, moduleSpecifier: `./${item.name}/${item.name}.component` };
    });
    componentsData = [
        ...componentsData,
        { name: 'CommonModule', moduleSpecifier: '@angular/common' },
        { name: 'NgModule', moduleSpecifier: '@angular/core' },
        { name: 'addBuiltInComponents', moduleSpecifier: '@docgeni/template' }
    ];

    const module = generateComponentsModule(sourceFile, ngModuleText, componentsData);
    return module;
}

async function generateNgModuleText(sourceFile: NgSourceFile, components: Map<string, ComponentBuilder>, moduleMetadata: NgModuleMetadata) {
    const builtInComponents = Array.from(components.values()).map(item => {
        return item.componentData;
    });
    const moduleMetadataArgs = Object.keys(moduleMetadata)
        .map(key => {
            return `${key}: [ ${moduleMetadata[key].join(', ')} ]`;
        })
        .join(',\n    ');
    const builtInComponentsArgs = builtInComponents
        .map(item => {
            return `{ selector: '${item.selector}', component: ${item.name} }`;
        })
        .join(`,`);

    return `
@NgModule({
${moduleMetadataArgs}
})
export class CustomComponentsModule {
constructor() {
    addBuiltInComponents([
        ${builtInComponentsArgs},
    ]);
}
}
`;
}
