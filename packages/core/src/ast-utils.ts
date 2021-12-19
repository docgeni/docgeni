import { HostTree } from '@angular-devkit/schematics';
import { NgSourceFile, ts, getNodeText } from '@docgeni/ngdoc';
import { applyToUpdateRecorder, Change, InsertChange } from '@schematics/angular/utility/change';
import { NgModuleMetadata } from './types/module';

export function generateComponentsModule(
    sourceFile: NgSourceFile,
    ngModuleText: string,
    importStructures: { name: string; moduleSpecifier: string }[]
): string {
    const changes = insertImports(sourceFile, importStructures);
    const sourceText = sourceFile.origin.getFullText();
    changes.push(new InsertChange(sourceFile.origin.fileName, sourceText.length, ngModuleText));
    return applyChanges(sourceFile.origin.fileName, sourceText, changes);
}

export function insertImports(sourceFile: NgSourceFile, importStructures: { name: string; moduleSpecifier: string }[]): Change[] {
    const changes: Change[] = [];
    const allImports = sourceFile.getImportDeclarations();
    const moduleSpecifiersMap = allImports.reduce<Record<string, ts.ImportDeclaration>>((result, item) => {
        result[getNodeText(item.moduleSpecifier)] = item;
        return result;
    }, {});
    const newImportPos = allImports.length > 0 ? allImports[allImports.length - 1].getEnd() : 0;

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

export function getNgModuleMetadataFromDefaultExport(sourceFile: NgSourceFile): NgModuleMetadata {
    return ((sourceFile.getDefaultExports() || {}) as unknown) as NgModuleMetadata;
}

export function combineNgModuleMetaData(metadata: NgModuleMetadata, appendMetadata: NgModuleMetadata): NgModuleMetadata {
    const defaultModuleMetadata = {
        declarations: [],
        entryComponents: [],
        providers: [],
        imports: [],
        exports: []
    };

    metadata = { ...defaultModuleMetadata, ...metadata };
    appendMetadata = { ...defaultModuleMetadata, ...appendMetadata };

    return {
        declarations: Array.from(new Set([...metadata.declarations, ...appendMetadata?.declarations])),
        entryComponents: Array.from(new Set([...metadata.entryComponents, ...appendMetadata?.entryComponents])),
        providers: Array.from(new Set([...metadata.providers, ...appendMetadata?.providers])),
        imports: Array.from(new Set([...metadata.imports, ...appendMetadata?.imports])),
        exports: Array.from(new Set([...metadata.exports, ...appendMetadata.exports]))
    };
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
