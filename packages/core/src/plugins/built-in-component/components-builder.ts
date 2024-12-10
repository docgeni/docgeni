import { createNgSourceFile, NgSourceFile } from '@docgeni/ngdoc';
import { fs, toolkit } from '@docgeni/toolkit';
import { DocgeniContext } from '../../docgeni.interface';
import { getSummaryStr } from '../../utils';
import { generateBuiltInComponentsModule } from './built-in-module';
import { ComponentBuilder } from './component-builder';

export interface ComponentDef {
    name: string;
    path: string;
}

export class ComponentsBuilder {
    private components = new Map<string, ComponentBuilder>();
    private componentsSourcePath: string;
    private componentsDistPath: string;
    private modulePath: string;

    constructor(private docgeni: DocgeniContext) {
        this.componentsSourcePath = toolkit.path.resolve(this.docgeni.paths.cwd, this.docgeni.config.componentsDir);
        this.componentsDistPath = toolkit.path.resolve(this.docgeni.paths.absSiteContentPath, 'components/custom');
        this.modulePath = toolkit.path.resolve(this.componentsSourcePath, 'module.ts');
    }

    private getComponentOfFile(fileFullPath: string) {
        const relativePath = toolkit.path.relative(this.componentsSourcePath, toolkit.path.normalize(fileFullPath));
        const name = relativePath.substring(0, relativePath.indexOf('/'));
        const componentPath = name ? toolkit.path.resolve(this.componentsSourcePath, toolkit.path.normalize(name)) : null;
        return {
            name,
            componentPath,
        };
    }

    watch() {
        if (!this.docgeni.watch) {
            return;
        }
        // toolkit.print.info(`Components: start watching ${this.componentsSourcePath}`);
        return this.docgeni.host.watch(this.componentsSourcePath, { ignoreInitial: true, recursive: true }).subscribe(async (item) => {
            try {
                if (item.path === this.modulePath) {
                    await this.emitEntryFile();
                    return;
                }
                const type: fs.HostWatchEventType = item.type as any;
                toolkit.print.info(`Components: ${getSummaryStr(item.path)}, type: ${fs.HostWatchEventType[item.type]}`);

                const { name, componentPath } = this.getComponentOfFile(item.path);
                if (!name) {
                    return;
                }
                let componentBuilder = componentPath ? this.components.get(componentPath) : undefined;
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
                    if (type === fs.HostWatchEventType.Created) {
                        componentBuilder = new ComponentBuilder(this.docgeni.host, name, componentPath, this.componentsDistPath);
                        await componentBuilder.buildAndEmit();
                        this.components.set(componentPath, componentBuilder);
                        toolkit.print.info(`Components: create component ${name} success`);
                    }
                }
                await this.emitEntryFile();
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
                const dirFullPath = toolkit.path.resolve(this.componentsSourcePath, dir);
                const isDirectory = await this.docgeni.host.isDirectory(dirFullPath);
                if (isDirectory) {
                    const componentBuilder = new ComponentBuilder(this.docgeni.host, dir, dirFullPath, this.componentsDistPath);
                    await componentBuilder.build();
                    this.components.set(dirFullPath, componentBuilder);
                }
            }
        }
    }

    async emitEntryFile() {
        let sourceFile: NgSourceFile;
        if (await this.docgeni.host.pathExists(this.modulePath)) {
            const sourceFileText = await this.docgeni.host.readFile(this.modulePath);
            sourceFile = createNgSourceFile(this.modulePath, sourceFileText);
        } else {
            sourceFile = createNgSourceFile(this.modulePath, '');
        }
        // filter built-in components that source contains angular component
        const components = Array.from(this.components.values()).filter((component) => !!component.metadata);
        const moduleText = await generateBuiltInComponentsModule(sourceFile, components);
        await this.docgeni.host.writeFile(toolkit.path.resolve(this.componentsDistPath, 'index.ts'), moduleText);
    }

    async emit() {
        for (const component of this.components.values()) {
            await component.emit();
        }
        await this.emitEntryFile();
    }
}
