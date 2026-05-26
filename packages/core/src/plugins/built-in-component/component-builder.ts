import { createNgSourceFile, NgComponentMetadata } from '@docgeni/ngdoc';
import { fs, toolkit } from '@docgeni/toolkit';

interface BuiltInComponentDefaultExport {
    selector: string;
    component: string;
    standalone?: string;
}

export class ComponentBuilder {
    public entryComponentFullPath: string;
    private distPath: string;
    private emitted = false;

    public metadata: NgComponentMetadata;

    constructor(
        private docgeniHost: fs.DocgeniFsHost,
        public name: string,
        public fullPath: string,
        distRootPath: string,
    ) {
        this.entryComponentFullPath = toolkit.path.resolve(fullPath, `${name}.component.ts`);
        this.distPath = toolkit.path.resolve(distRootPath, name);
    }

    private async buildMetadata() {
        this.metadata = null;

        if (!(await this.exists())) {
            return;
        }
        const componentText = await this.docgeniHost.readFile(this.entryComponentFullPath);
        const componentFile = createNgSourceFile(this.entryComponentFullPath, componentText);
        const exportDefault = componentFile.getDefaultExports<BuiltInComponentDefaultExport>();

        if (exportDefault) {
            const exportedComponents = componentFile.getExportedComponents();
            const matchedComponent = exportedComponents.find((item) => item.name === exportDefault.component) ?? exportedComponents[0];

            this.metadata = {
                selector: exportDefault.selector ?? matchedComponent?.selector,
                name: exportDefault.component ?? matchedComponent?.name,
                standalone: this.resolveStandalone(exportDefault, matchedComponent),
            };
        } else {
            const exportedComponents = componentFile.getExportedComponents();
            if (exportedComponents.length > 0) {
                this.metadata = {
                    selector: exportedComponents[0].selector,
                    name: exportedComponents[0].name,
                    standalone: exportedComponents[0].standalone,
                };
            } else {
                this.metadata = null;
            }
        }
    }

    async exists() {
        const result = await this.docgeniHost.pathExists(this.entryComponentFullPath);
        return result;
    }

    async build() {
        this.emitted = false;
        await this.buildMetadata();
    }

    async emit() {
        if (this.emitted) {
            return;
        }
        await this.docgeniHost.copy(this.fullPath, this.distPath);
        this.emitted = true;
    }

    async buildAndEmit() {
        await this.build();
        await this.emit();
    }

    async clear() {
        await this.docgeniHost.delete(this.distPath);
    }

    private resolveStandalone(exportDefault: BuiltInComponentDefaultExport, component?: NgComponentMetadata): boolean {
        if (exportDefault.standalone === 'true') {
            return true;
        }
        if (exportDefault.standalone === 'false') {
            return false;
        }
        return component?.standalone ?? true;
    }
}
