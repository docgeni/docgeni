import { createNgSourceFile, NgSourceFile } from '@docgeni/ngdoc';
import { toolkit } from '@docgeni/toolkit';
import { DocgeniContext } from '../../docgeni.interface';
import { HostWatchEventType, normalize, relative, resolve } from '../../fs';
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
        this.componentsSourcePath = resolve(this.docgeni.paths.cwd, this.docgeni.config.componentsDir);
        this.componentsDistPath = resolve(this.docgeni.paths.absSiteContentPath, 'components/custom');
        this.modulePath = resolve(this.componentsSourcePath, 'module.ts');
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
                if (item.path === this.modulePath) {
                    await this.emitEntryFile();
                    return;
                }
                const type: HostWatchEventType = item.type as any;
                toolkit.print.info(`Components: ${getSummaryStr(item.path)}, type: ${HostWatchEventType[item.type]}`);

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
                    if (type === HostWatchEventType.Created) {
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
                const dirFullPath = resolve(this.componentsSourcePath, dir);
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
        const components = Array.from(this.components.values()).filter(component => !!component.componentData);
        const moduleText = await generateBuiltInComponentsModule(sourceFile, components);
        await this.docgeni.host.writeFile(resolve(this.componentsDistPath, 'index.ts'), moduleText);
    }

    async emit() {
        for (const component of this.components.values()) {
            await component.emit();
        }
        await this.emitEntryFile();
    }
}
