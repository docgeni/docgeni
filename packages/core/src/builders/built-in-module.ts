import { NgSourceFile, ts, getNodeText } from '@docgeni/ngdoc';
import { Change, InsertChange } from '@schematics/angular/utility/change';
import { NgModuleMetadata } from '../types/module';
import { ComponentBuilder } from './component-builder';
import { applyChanges } from '../utils';

export async function generateBuiltInComponentsModule(sourceFile: NgSourceFile, components: Map<string, ComponentBuilder>) {
    const changes = await getModuleChanges(sourceFile, components);
    const sourceText = sourceFile.origin.getFullText();
    const ngModuleText = await generateNgModuleText(sourceFile, components);
    changes.push(new InsertChange(sourceFile.origin.fileName, sourceText.length, ngModuleText));
    return applyChanges(sourceFile.origin.fileName, sourceText, changes);
}

async function getModuleMetaData(sourceFile: NgSourceFile, components: Map<string, ComponentBuilder>) {
    let moduleMetadata: NgModuleMetadata = (sourceFile.getDefaultExports() as unknown) as NgModuleMetadata;
    const declarations: string[] = Array.from(components.values()).map(item => {
        return item.componentData?.name;
    });
    const defaultModuleMetadata = {
        imports: ['CommonModule']
    };

    if (moduleMetadata) {
        moduleMetadata.declarations = [...(moduleMetadata.declarations || []), ...declarations];
        moduleMetadata.entryComponents = [...(moduleMetadata.entryComponents || []), ...declarations];
        moduleMetadata.providers = moduleMetadata.providers || [];
        moduleMetadata.imports = (moduleMetadata.imports || []).concat(defaultModuleMetadata.imports);
        moduleMetadata.exports = moduleMetadata.declarations;
    } else {
        moduleMetadata = {
            declarations: [...declarations],
            entryComponents: declarations,
            providers: [],
            imports: [...defaultModuleMetadata.imports],
            exports: declarations
        };
    }
    return moduleMetadata;
}

async function getModuleChanges(sourceFile: NgSourceFile, components: Map<string, ComponentBuilder>) {
    const changes: Change[] = [];
    const allImports = sourceFile.getImportDeclarations();
    const moduleSpecifiersMap = allImports.reduce<Record<string, ts.ImportDeclaration>>((result, item) => {
        result[getNodeText(item.moduleSpecifier)] = item;
        return result;
    }, {});
    const newImportPos = allImports.length > 0 ? allImports[allImports.length - 1].getEnd() : 0;
    const componentsData = Array.from(components.values()).map(item => {
        return { name: item.componentData.name, moduleSpecifier: `./${item.name}/${item.name}.component` };
    });
    const importStructures = [
        { name: 'NgModule', moduleSpecifier: '@angular/core' },
        { name: 'CommonModule', moduleSpecifier: '@angular/common' },
        { name: 'addBuiltInComponents', moduleSpecifier: '@docgeni/template' },
        ...componentsData
    ];
    importStructures.forEach((structure, index) => {
        const insertAtBeginning = allImports.length === 0 && index === 0;
        const importDeclaration = moduleSpecifiersMap[structure.moduleSpecifier];
        if (importDeclaration) {
            let addPos = 0;
            if (importDeclaration.importClause.namedBindings) {
                if (ts.isNamedImports(importDeclaration.importClause.namedBindings)) {
                    const hasNamed = !!importDeclaration.importClause.namedBindings.elements.find(element => {
                        return element.name.getText() === structure.name;
                    });
                    addPos = importDeclaration.importClause.namedBindings.getLastToken().pos;
                    if (!hasNamed) {
                        changes.push(new InsertChange(sourceFile.origin.fileName, addPos, `, ${structure.name}`));
                    }
                }
            } else {
                addPos = importDeclaration.importClause.name.end;
            }
        } else {
            changes.push(
                new InsertChange(
                    sourceFile.origin.fileName,
                    newImportPos,
                    `${insertAtBeginning ? '' : '\n'}import { ${structure.name} } from '${structure.moduleSpecifier}';`
                )
            );
        }
    });
    return changes;
}

async function generateNgModuleText(sourceFile: NgSourceFile, components: Map<string, ComponentBuilder>) {
    const moduleMetadata: NgModuleMetadata = await getModuleMetaData(sourceFile, components);
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
