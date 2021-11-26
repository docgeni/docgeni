import { HostTree } from '@angular-devkit/schematics';
import { Change, InsertChange, RemoveChange, applyToUpdateRecorder } from '@schematics/angular/utility/change';
import { ts, NgSourceFile, getNodeText } from '@docgeni/ngdoc';

export interface NgModuleMetadata {
    declarations: string[];
    providers: string[];
    imports: string[];
    entryComponents: string[];
    exports: string[];
}

export function generateComponentExamplesModule(
    sourceFile: NgSourceFile,
    ngModuleName: string,
    components: { name: string; moduleSpecifier: string }[]
) {
    let moduleMetadata = (sourceFile.getDefaultExports() as unknown) as NgModuleMetadata;
    const declarations = components.map(item => item.name);
    if (moduleMetadata) {
        moduleMetadata.declarations = [...(moduleMetadata.declarations || []), ...declarations];
        moduleMetadata.entryComponents = [...(moduleMetadata.entryComponents || []), ...declarations];
        moduleMetadata.providers = moduleMetadata.providers || [];
        moduleMetadata.imports = moduleMetadata.imports || [];
        moduleMetadata.exports = moduleMetadata.declarations;
    } else {
        moduleMetadata = {
            declarations: declarations,
            entryComponents: declarations,
            providers: [],
            imports: [],
            exports: declarations
        };
    }

    const changes: Change[] = [];
    const allImports = sourceFile.getImportDeclarations();
    const moduleSpecifiersMap = allImports.reduce<Record<string, ts.ImportDeclaration>>((result, item) => {
        result[getNodeText(item.moduleSpecifier)] = item;
        return result;
    }, {});
    const newImportPos = allImports.length > 0 ? allImports[allImports.length - 1].getEnd() : 0;
    const importStructures = [{ name: 'NgModule', moduleSpecifier: '@angular/core' }, ...components];
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

    const sourceText = sourceFile.origin.getFullText();
    const ngModuleText = generateNgModuleText(ngModuleName, moduleMetadata);
    changes.push(new InsertChange(sourceFile.origin.fileName, sourceText.length, ngModuleText));
    return applyChanges(sourceFile.origin.fileName, sourceText, changes);
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

function applyChanges(filePath: string, originContent: string, changes: Change[]) {
    const hostTree = new HostTree();
    hostTree.create(filePath, originContent);
    const updater = hostTree.beginUpdate(filePath);
    applyToUpdateRecorder(updater, changes);
    hostTree.commitUpdate(updater);
    const fileEntry = hostTree.get(filePath);
    return fileEntry.content.toString();
}
