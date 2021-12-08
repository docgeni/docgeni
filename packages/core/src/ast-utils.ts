import { HostTree } from '@angular-devkit/schematics';
import { NgSourceFile, ts, getNodeText } from '@docgeni/ngdoc';
import { applyToUpdateRecorder, Change, InsertChange } from '@schematics/angular/utility/change';
import { NgModuleMetadata } from './types/module';

export async function generateComponentsModule(
    sourceFile: NgSourceFile,
    ngModuleText: string,
    components: { name: string; moduleSpecifier: string }[]
) {
    const changes = await getModuleChanges(sourceFile, components);
    const sourceText = sourceFile.origin.getFullText();
    changes.push(new InsertChange(sourceFile.origin.fileName, sourceText.length, ngModuleText));
    return applyChanges(sourceFile.origin.fileName, sourceText, changes);
}

export async function getModuleChanges(sourceFile: NgSourceFile, components: { name: string; moduleSpecifier: string }[] = []) {
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
    return changes;
}

export async function getModuleMetaData(sourceFile: NgSourceFile, extraModuleMetadata: NgModuleMetadata) {
    const defaultModuleMetadata = {
        declarations: [],
        entryComponents: [],
        providers: [],
        imports: [],
        exports: []
    };

    let exportModuleMetadata: NgModuleMetadata = (sourceFile.getDefaultExports() as unknown) as NgModuleMetadata;
    exportModuleMetadata = { ...defaultModuleMetadata, ...exportModuleMetadata };

    const moduleMetadata = { ...defaultModuleMetadata, ...extraModuleMetadata };

    if (exportModuleMetadata) {
        moduleMetadata.declarations = Array.from(new Set([...moduleMetadata.declarations, ...exportModuleMetadata?.declarations]));
        moduleMetadata.entryComponents = Array.from(new Set([...moduleMetadata.entryComponents, ...exportModuleMetadata?.entryComponents]));
        moduleMetadata.providers = Array.from(new Set([...moduleMetadata.providers, ...exportModuleMetadata?.providers]));
        moduleMetadata.imports = Array.from(new Set([...moduleMetadata.imports, ...exportModuleMetadata?.imports]));
        moduleMetadata.exports = Array.from(
            new Set([...moduleMetadata.declarations, ...moduleMetadata.exports, ...exportModuleMetadata?.exports])
        );
    }
    return moduleMetadata;
}

export function applyChanges(filePath: string, originContent: string, changes: Change[]) {
    const hostTree = new HostTree();
    hostTree.create(filePath, originContent);
    const updater = hostTree.beginUpdate(filePath);
    applyToUpdateRecorder(updater, changes);
    hostTree.commitUpdate(updater);
    const fileEntry = hostTree.get(filePath);
    return fileEntry.content.toString();
}
