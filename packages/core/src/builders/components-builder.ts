import { DocgeniContext } from '../docgeni.interface';
import { DocgeniHost } from '../docgeni-host';
import { toolkit } from '@docgeni/toolkit';
import { normalize, relative, resolve, HostWatchEventType } from '../fs';
import { getSummaryStr } from '../utils';

export interface ComponentDef {
    name: string;
    path: string;
}

export class ComponentBuilder {
    public entryComponentFullPath: string;
    private distPath: string;
    private emitted = false;

    constructor(private docgeniHost: DocgeniHost, public name: string, public fullPath: string, distRootPath: string) {
        this.entryComponentFullPath = resolve(fullPath, `${name}.component.ts`);
        this.distPath = resolve(distRootPath, name);
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

export class ComponentsBuilder {
    private components = new Map<string, ComponentBuilder>();
    private componentsSourcePath: string;
    private componentsDistPath: string;

    constructor(private docgeni: DocgeniContext) {
        this.componentsSourcePath = resolve(this.docgeni.paths.cwd, this.docgeni.config.componentsDir);
        this.componentsDistPath = resolve(this.docgeni.paths.absSiteContentPath, 'components/custom');
    }

    private getComponentOfFile(fileFullPath: string) {
        const relativePath = relative(this.componentsSourcePath, normalize(fileFullPath));
        const name = relativePath.substring(0, relativePath.indexOf('/'));
        const componentPath = name ? resolve(this.componentsSourcePath, normalize(name)) : null;
        return {
            name,
            componentPath
        };
    }

    watch() {
        if (!this.docgeni.watch) {
            return;
        }
        // toolkit.print.info(`Components: start watching ${this.componentsSourcePath}`);
        return this.docgeni.host.watch(this.componentsSourcePath, { ignoreInitial: true, recursive: true }).subscribe(async item => {
            try {
                const type: HostWatchEventType = item.type as any;
                toolkit.print.info(`Components: ${getSummaryStr(item.path)}, type: ${HostWatchEventType[item.type]}`);
                const { name, componentPath } = this.getComponentOfFile(item.path);
                if (!name) {
                    return;
                }
                const componentBuilder = componentPath ? this.components.get(componentPath) : undefined;
                if (componentBuilder) {
                    if (await componentBuilder.exists()) {
                        await componentBuilder.buildAndEmit();
                        toolkit.print.info(`Components: build and emit component ${name} success`);
                    } else {
                        this.components.delete(componentPath);
                        await componentBuilder.clear();
                        toolkit.print.info(`Components: clear component ${name} success`);
                    }
                } else {
                    if (type === HostWatchEventType.Created) {
                        const componentBuilder = new ComponentBuilder(this.docgeni.host, name, componentPath, this.componentsDistPath);
                        this.components.set(componentPath, componentBuilder);
                        await componentBuilder.buildAndEmit();
                        toolkit.print.info(`Components: create component ${name} success`);
                    }
                }
                this.emitEntryFile();
            } catch (error) {
                toolkit.print.error(error);
            }
        });
    }

    async isExist(): Promise<boolean> {
        const result = await this.docgeni.host.pathExists(this.componentsSourcePath);
        return result;
    }

    async build() {
        if (await this.isExist()) {
            const allDirs = await this.docgeni.host.list(this.componentsSourcePath);
            for (const dir of allDirs) {
                const dirFullPath = resolve(this.componentsSourcePath, dir);
                const isDirectory = await this.docgeni.host.isDirectory(dirFullPath);
                if (isDirectory) {
                    const componentBuilder = new ComponentBuilder(this.docgeni.host, dir, dirFullPath, this.componentsDistPath);
                    this.components.set(dirFullPath, componentBuilder);
                }
            }
        }
    }

    async emitEntryFile() {
        const componentsData: { name: string }[] = Array.from(this.components.values()).map(item => {
            return { name: item.name };
        });
        const entryContent = toolkit.template.compile('components-entry.hbs', {
            components: componentsData
        });
        await this.docgeni.host.writeFile(resolve(this.componentsDistPath, 'index.ts'), entryContent);
    }

    async emit() {
        for (const component of this.components.values()) {
            await component.emit();
        }
        this.emitEntryFile();
    }
}
