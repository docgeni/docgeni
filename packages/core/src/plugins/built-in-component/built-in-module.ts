import { NgSourceFile } from '@docgeni/ngdoc';
import { combineNgModuleMetadata, getNgModuleMetadataFromDefaultExport } from '../../ast-utils';
import { NgSourceUpdater } from '../../ng-source-updater';
import { NgModuleMetadata } from '../../types/module';
import { ComponentBuilder } from './component-builder';

export async function generateBuiltInComponentsModule(sourceFile: NgSourceFile, components: ComponentBuilder[]) {
    const componentsBuilders = Array.from(components.values());
    const declarations: string[] = componentsBuilders
        .filter(item => !item.metadata?.standalone)
        .map(item => {
            return item.metadata?.name;
        });
    const importsComponents: string[] = componentsBuilders
        .filter(item => item.metadata?.standalone)
        .map(item => {
            return item.metadata?.name;
        });
    const defaultModuleMetadata = getNgModuleMetadataFromDefaultExport(sourceFile);
    const moduleMetadata: NgModuleMetadata = combineNgModuleMetadata(defaultModuleMetadata, {
        imports: ['CommonModule', ...importsComponents],
        declarations: [...declarations],
        entryComponents: [...declarations],
        exports: [...declarations]
    });

    const updater = new NgSourceUpdater(sourceFile);
    const ngModuleText = await generateNgModuleText(sourceFile, components, moduleMetadata);

    let componentsImportStructures = Array.from(components.values()).map(item => {
        return { name: item.metadata.name, moduleSpecifier: `./${item.name}/${item.name}.component` };
    });
    componentsImportStructures = [
        ...componentsImportStructures,
        { name: 'CommonModule', moduleSpecifier: '@angular/common' },
        { name: 'NgModule', moduleSpecifier: '@angular/core' },
        { name: 'addBuiltInComponents', moduleSpecifier: '@docgeni/template' }
    ];
    updater.insertImports(componentsImportStructures);
    updater.insertNgModuleByText(ngModuleText);
    updater.removeDefaultExport();
    return updater.update();
}

async function generateNgModuleText(sourceFile: NgSourceFile, components: ComponentBuilder[], moduleMetadata: NgModuleMetadata) {
    const builtInComponents = Array.from(components.values()).map(item => {
        return item.metadata;
    });
    const moduleMetadataArgs = Object.keys(moduleMetadata)
        .map(key => {
            return `${key}: [ ${moduleMetadata[key].join(', ')} ]`;
        })
        .join(',\n    ');
    const builtInComponentsArgs = builtInComponents
        .filter(item => !!item && item.selector)
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
    addBuiltInComponents([${builtInComponentsArgs}]);
  }
}
`;
}
