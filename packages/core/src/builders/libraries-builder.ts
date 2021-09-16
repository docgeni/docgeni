import { ValidationError } from './../errors/validation-error';
import { DocgeniContext } from '../docgeni.interface';
import { DocgeniLibrary, Library, LiveExample } from '../interfaces';
import { toolkit } from '@docgeni/toolkit';
import { LibraryBuilder } from './library-builder';
import { normalizeLibConfig } from './normalize';
import { resolve } from '../fs';
import { SyncHook } from 'tapable';
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
        buildLibraries: new SyncHook<LibrariesBuilder, LibraryBuilder[], LibComponent[]>([
            'librariesBuilder',
            'libraryBuilders',
            'components'
        ]),
        buildLibrariesSucceed: new SyncHook<LibrariesBuilder, LibraryBuilder[], LibComponent[]>([
            'librariesBuilder',
            'libraryBuilders',
            'components'
        ])
    };

    constructor(private docgeni: DocgeniContext) {}

    /**
     * Initialize libs, normalize and validate lib config
     */
    public async initialize() {
        this.absDestSiteContentPath = this.docgeni.paths.absSiteContentPath;
        const normalizedConfigs = this.config.libs.map(lib => {
            const result = normalizeLibConfig(lib);
            return result;
        });
        for (const normalizedConfig of normalizedConfigs) {
            await this.verifyLibConfig(normalizedConfig);
        }
        this.libraryBuilders = normalizedConfigs.map(normalizedConfig => {
            return new LibraryBuilder(this.docgeni, normalizedConfig);
        });
    }

    private async verifyLibConfig(lib: DocgeniLibrary): Promise<void> {
        if (!lib.name) {
            throw new ValidationError(`lib's name is required`);
        }
        if (!lib.rootDir) {
            throw new ValidationError(`${lib.name} lib's rootDir is required`);
        }

        const allCategoriesIds: string[] = [];
        for (const category of lib.categories) {
            if (!category.id) {
                throw new ValidationError(`${lib.name} lib's category id is required`);
            }
            if (!category.title) {
                throw new ValidationError(`${lib.name} lib's category title is required`);
            }
            allCategoriesIds.push(category.id);
        }

        const duplicateId = allCategoriesIds.find((item, index) => {
            return allCategoriesIds.indexOf(item) !== index;
        });
        if (duplicateId) {
            throw new ValidationError(`${lib.name} lib's category id(${duplicateId}) duplicate`);
        }
        const rootDirExists = await this.docgeni.host.pathExists(lib.rootDir);
        if (!rootDirExists) {
            throw new ValidationError(`${lib.name} lib's rootDir(${lib.rootDir}) has not exists`);
        }
    }

    public async build() {
        if (this.building) {
            throw new Error(`LibrariesBuilder is building`);
        }
        this.building = true;
        try {
            this.hooks.buildLibraries.call(this, this.libraryBuilders);
            for (const libraryBuilder of this.libraryBuilders) {
                await libraryBuilder.initialize();
                await libraryBuilder.build();
            }
            this.hooks.buildLibrariesSucceed.call(this, this.libraryBuilders);
        } catch (error) {
            this.docgeni.logger.error(error);
            this.docgeni.logger.error(error.stack);
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
        if (this.docgeni.watch) {
            this.libraries.forEach(libraryBuilder => {
                libraryBuilder.watch();
                libraryBuilder.hooks.build.tap('LibrariesBuilder', (builder, components) => {
                    this.hooks.buildLibraries.call(this, [builder], components);
                });
                libraryBuilder.hooks.buildSucceed.tap('LibrariesBuilder', (builder, components) => {
                    this.hooks.buildLibrariesSucceed.call(this, [builder], components);
                });
            });
        }
    }

    private async emitAllEntries() {
        const { moduleKeys, liveExampleComponents } = this.getAllComponentsModulesAndExamples();

        const componentExamplesContent = toolkit.template.compile('component-examples.hbs', {
            data: JSON.stringify(liveExampleComponents, null, 4)
        });
        await this.docgeni.host.writeFile(resolve(this.absDestSiteContentPath, 'component-examples.ts'), componentExamplesContent);

        const exampleLoaderContent = toolkit.template.compile('example-loader.hbs', {
            moduleKeys,
            enableIvy: this.docgeni.enableIvy
        });
        await this.docgeni.host.writeFile(resolve(this.docgeni.paths.absSiteContentPath, 'example-loader.ts'), exampleLoaderContent);

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
        const exampleModulesContent = toolkit.template.compile('example-modules.hbs', {
            modules
        });
        await this.docgeni.host.writeFile(resolve(this.docgeni.paths.absSiteContentPath, 'example-modules.ts'), exampleModulesContent);

        const contentIndexContent = toolkit.template.compile('content-index.hbs', {});
        await this.docgeni.host.writeFile(resolve(this.docgeni.paths.absSiteContentPath, 'index.ts'), contentIndexContent);
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
