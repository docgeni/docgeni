import { NgSourceFile } from '@docgeni/ngdoc';
import { Change, InsertChange, RemoveChange } from '@schematics/angular/utility/change';
import { applyChanges, generateNgModuleText, insertImports } from './ast-utils';
import { NgModuleMetadata } from './types/module';

export class NgSourceUpdater {
    private changes: Change[] = [];
    constructor(private sourceFile: NgSourceFile) {}

    insertImports(importStructures: { name: string; moduleSpecifier: string }[]) {
        this.changes = [...this.changes, ...insertImports(this.sourceFile, importStructures)];
        return this;
    }

    removeDefaultExport() {
        const defaultExportNode = this.sourceFile.getDefaultExportNode();
        if (defaultExportNode) {
            this.changes.push(new RemoveChange(this.sourceFile.origin.fileName, defaultExportNode.pos, defaultExportNode.getFullText()));
        }
        return this;
    }

    insertNgModuleByText(ngModuleText: string) {
        const defaultExportNode = this.sourceFile.getDefaultExportNode();
        this.changes.push(
            new InsertChange(
                this.sourceFile.origin.fileName,
                defaultExportNode ? defaultExportNode.pos : this.sourceFile.length,
                ngModuleText
            )
        );
        return this;
    }

    insertNgModule(moduleName: string, metadata: NgModuleMetadata) {
        const moduleText = generateNgModuleText(moduleName, metadata);
        this.insertNgModuleByText(moduleText);
        return this;
    }

    update(): string {
        const sourceText = this.sourceFile.origin.getFullText();
        return applyChanges(this.sourceFile.origin.fileName, sourceText, this.changes);
    }
}
