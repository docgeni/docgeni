import { getNodeText, NgSourceFile, ts } from '@docgeni/ngdoc';
import { Change, InsertChange, RemoveChange } from '@schematics/angular/utility/change';
import { toolkit } from '@docgeni/toolkit';
import { applyChanges, generateAppConfigText, generateNgModuleText, insertImports } from './ast-utils';
import { NgModuleMetadata } from './types/module';

export type InsertProvidersTarget = 'imports' | 'providers';

function toSymbolArray(entries?: string | string[]): string[] {
    if (!entries) {
        return [];
    }
    return toolkit.utils.isArray(entries) ? entries : [entries];
}

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
                ngModuleText,
            ),
        );
        return this;
    }

    insertNgModule(moduleName: string, metadata: NgModuleMetadata) {
        const moduleText = generateNgModuleText(moduleName, metadata);
        this.insertNgModuleByText(moduleText);
        return this;
    }

    insertAppConfigByText(providerEntries: string[]) {
        this.insertNgModuleByText(generateAppConfigText(providerEntries));
        return this;
    }

    insertProviders(entries: string | string[] | undefined, target: InsertProvidersTarget) {
        const items = toSymbolArray(entries);
        if (items.length === 0) {
            return this;
        }

        const providersArray = this.sourceFile.getExportedConstArrayLiteral('appConfig', 'providers');
        if (!providersArray) {
            return this;
        }

        if (target === 'imports') {
            this.insertImportProvidersFromEntries(providersArray, items);
        } else {
            this.insertAppConfigProviderEntries(providersArray, items);
        }
        return this;
    }

    private insertImportProvidersFromEntries(providersArray: ts.ArrayLiteralExpression, entries: string[]) {
        const importProvidersFromCall = providersArray.elements.find((element) => {
            return ts.isCallExpression(element) && getNodeText(element.expression).trim() === 'importProvidersFrom';
        }) as ts.CallExpression | undefined;

        if (!importProvidersFromCall) {
            return;
        }

        const insertPos = importProvidersFromCall.getStart() + getNodeText(importProvidersFromCall.expression).length + 1;
        const text = entries.join(', ') + (importProvidersFromCall.arguments.length > 0 ? ', ' : '');
        this.changes.push(new InsertChange(this.sourceFile.origin.fileName, insertPos, text));
    }

    private insertAppConfigProviderEntries(providersArray: ts.ArrayLiteralExpression, entries: string[]) {
        const siteProvidersElement = providersArray.elements.find((element) => {
            return getNodeText(element).trim().includes('DOCGENI_SITE_PROVIDERS');
        });
        const insertPos = siteProvidersElement ? siteProvidersElement.getStart() : providersArray.getEnd() - 1;
        const text = `\n        ${entries.join(',\n        ')},\n        `;
        this.changes.push(new InsertChange(this.sourceFile.origin.fileName, insertPos, text));
    }

    update(): string {
        const sourceText = this.sourceFile.origin.getFullText();
        return applyChanges(this.sourceFile.origin.fileName, sourceText, this.changes);
    }
}
