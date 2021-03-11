import { DocgeniContext } from '../docgeni.interface';
import { Library, LiveExample } from '../interfaces';
import * as path from 'path';
import { toolkit } from '@docgeni/toolkit';
import { AsyncSeriesHook, SyncHook } from 'tapable';
import { LibraryBuilder } from './library-builder';
import { DEFAULT_COMPONENT_API_DIR, DEFAULT_COMPONENT_DOC_DIR, DEFAULT_COMPONENT_EXAMPLES_DIR } from '../constants';
import * as chokidar from 'chokidar';
import { LibComponent } from './library-component';

export class LibrariesBuilder {
    private libraryBuilders: LibraryBuilder[];
    private absDestSiteContentPath: string;

    private building = false;
    private emitting = false;

    private get config() {
        return this.docgeni.config;
    }

    public get libraries() {
        return this.libraryBuilders;
    }

    public hooks = {
        buildLibraries: new SyncHook<LibrariesBuilder>(['librariesBuilder']),
        buildLibrariesSucceed: new SyncHook<LibrariesBuilder>(['librariesBuilder'])
    };

    constructor(private docgeni: DocgeniContext) {
        this.absDestSiteContentPath = docgeni.paths.absSiteContentPath;
        this.libraryBuilders = this.config.libs.map(lib => {
            this.normalizeLibConfig(lib);
            return new LibraryBuilder(docgeni, lib);
        });
    }

    public async build() {
        if (this.building) {
            throw new Error(`LibrariesBuilder is building`);
        }
        this.building = true;
        try {
            this.hooks.buildLibraries.call(this);
            for (const libraryBuilder of this.libraryBuilders) {
                await libraryBuilder.build();
            }
            this.hooks.buildLibrariesSucceed.call(this);
        } catch (error) {
            this.docgeni.logger.error(error);
        } finally {
            this.building = false;
        }
    }

    public async emit() {
        if (this.emitting) {
            throw new Error(`LibrariesBuilder is emitting`);
        }
        this.emitting = true;
        try {
            for (const libraryBuilder of this.libraryBuilders) {
                await libraryBuilder.emit();
            }
            await this.emitAllEntries();
        } catch (error) {
            this.docgeni.logger.error(error);
        } finally {
            this.emitting = false;
        }
    }

    public watch() {
        if (!this.docgeni.watch) {
            return;
        }
        const watchedDirs: string[] = [];
        const componentDirs = [];
        const dirToComponent: Record<string, LibComponent> = {};
        this.libraries.forEach(libraryBuilder => {
            for (const [key, component] of libraryBuilder.components) {
                componentDirs.push(key);
                dirToComponent[key] = component;
                watchedDirs.push(component.absDocPath);
                watchedDirs.push(component.absApiPath);
                watchedDirs.push(component.absExamplesPath);
            }
        });

        const watcher = chokidar.watch(watchedDirs, { ignoreInitial: true, interval: 1000 });
        watcher.on('all', async (event, filePath) => {
            // this.docgeni.logger.info(`${event}  ${filePath}`);
            const componentDir = componentDirs.find(componentDir => {
                return filePath.includes(componentDir);
            });
            if (componentDir) {
                const component = dirToComponent[componentDir];
                await component.build();
                this.hooks.buildLibrariesSucceed.call(this);
            }
        });
    }

    private normalizeLibConfig(lib: Library): void {
        lib.docDir = lib.docDir || DEFAULT_COMPONENT_DOC_DIR;
        lib.apiDir = lib.apiDir || DEFAULT_COMPONENT_API_DIR;
        lib.examplesDir = lib.examplesDir || DEFAULT_COMPONENT_EXAMPLES_DIR;
        lib.absRootPath = path.resolve(this.docgeni.paths.cwd, lib.rootDir);
    }

    private async emitAllEntries() {
        const { moduleKeys, liveExampleComponents } = this.getAllComponentsModulesAndExamples();

        await toolkit.template.generate('component-examples.hbs', path.resolve(this.absDestSiteContentPath, 'component-examples.ts'), {
            data: JSON.stringify(liveExampleComponents, null, 4)
        });
        await toolkit.template.generate('example-loader.hbs', path.resolve(this.docgeni.paths.absSiteContentPath, 'example-loader.ts'), {
            moduleKeys,
            enableIvy: this.docgeni.enableIvy
        });

        // generate all modules fallback for below angular 9
        const modules: Array<{
            key: string;
            name: string;
        }> = [];
        for (const key of moduleKeys) {
            modules.push({
                key,
                name: toolkit.strings.pascalCase(key.replace('/', '-'))
            });
        }
        await toolkit.template.generate('example-modules.hbs', path.resolve(this.docgeni.paths.absSiteContentPath, 'example-modules.ts'), {
            modules
        });
        await toolkit.template.generate('content-index.hbs', path.resolve(this.docgeni.paths.absSiteContentPath, 'index.ts'), {});
    }

    private getAllComponentsModulesAndExamples(): { moduleKeys: string[]; liveExampleComponents: Record<string, LiveExample> } {
        const moduleKeys: string[] = [];
        const liveExampleComponents: Record<string, LiveExample> = {};
        this.libraryBuilders.forEach(libraryBuilder => {
            libraryBuilder.components.forEach(component => {
                // exclude components without examples
                if (!toolkit.utils.isEmpty(component.examples)) {
                    moduleKeys.push(component.getModuleKey());
                    component.examples.forEach(example => {
                        liveExampleComponents[example.key] = {
                            ...example,
                            sourceFiles: example.sourceFiles.map(sourceFile => {
                                return {
                                    name: sourceFile.name,
                                    highlightedPath: sourceFile.highlightedPath
                                };
                            })
                        };
                    });
                }
            });
        });
        return {
            moduleKeys,
            liveExampleComponents
        };
    }
}
