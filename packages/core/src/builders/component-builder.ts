import { createNgSourceFile } from '@docgeni/ngdoc';
import { DocgeniHost } from '../docgeni-host';
import { resolve } from '../fs';

export class ComponentBuilder {
    public entryComponentFullPath: string;
    private distPath: string;
    private emitted = false;

    public componentData: { selector: string; name: string };

    constructor(private docgeniHost: DocgeniHost, public name: string, public fullPath: string, distRootPath: string) {
        this.entryComponentFullPath = resolve(fullPath, `${name}.component.ts`);
        this.distPath = resolve(distRootPath, name);
    }

    async setComponentData() {
        const componentPath = resolve(this.fullPath, `${this.name}.component.ts`);
        const componentText = await this.docgeniHost.readFile(componentPath);
        const componentFile = createNgSourceFile(componentPath, componentText);
        const exportDefault = componentFile.getDefaultExports();

        if (exportDefault) {
            this.componentData = { selector: exportDefault.selector, name: exportDefault.component };
        } else {
            const exportedComponents = componentFile.getExportedComponents();
            this.componentData = { selector: exportedComponents[0].selector, name: exportedComponents[0].name };
        }
    }

    async exists() {
        const result = await this.docgeniHost.pathExists(this.entryComponentFullPath);
        return result;
    }

    async build() {
        this.emitted = false;
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
}
