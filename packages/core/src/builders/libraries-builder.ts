import { ValidationError } from './../errors/validation-error';
import { DocgeniContext } from '../docgeni.interface';
import { DocgeniLibrary, LiveExample } from '../interfaces';
import { toolkit } from '@docgeni/toolkit';
import { LibraryBuilderImpl } from './library-builder';
import { normalizeLibConfig } from './normalize';
import { FileEmitter } from './emitter';

export class LibrariesBuilder extends FileEmitter {
    private libraryBuilders: LibraryBuilderImpl[] = [];
    private absDestSiteContentPath: string;

    private building = false;
    private emitting = false;

    private get config() {
        return this.docgeni.config;
    }

    public get libraries() {
        return this.libraryBuilders;
    }

    constructor(private docgeni: DocgeniContext) {
        super();
    }

    public async run() {
        await this.initialize();
        await this.build();
        await this.emit();
    }

    /**
     * Initialize libs, normalize and validate lib config
     */
    public async initialize() {
        this.absDestSiteContentPath = this.docgeni.paths.absSiteContentPath;
        const normalizedConfigs = this.config.libs.map((lib) => {
            const result = normalizeLibConfig(lib);
            return result;
        });
        for (const normalizedConfig of normalizedConfigs) {
            await this.verifyLibConfig(normalizedConfig);
        }
        this.libraryBuilders = normalizedConfigs.map((normalizedConfig) => {
            return new LibraryBuilderImpl(this.docgeni, normalizedConfig);
        });
        for (const libraryBuilder of this.libraryBuilders) {
            await libraryBuilder.initialize();
        }
    }

    public async build() {
        if (this.building) {
            throw new Error(`LibrariesBuilder is building`);
        }
        this.building = true;
        try {
            for (const libraryBuilder of this.libraryBuilders) {
                await libraryBuilder.build();
            }
            this.resetEmitted();
        } catch (error) {
            this.docgeni.logger.error(error);
            this.docgeni.logger.error(error.stack);
        } finally {
            this.building = false;
        }
    }

    public async onEmit() {
        if (this.emitting) {
            throw new Error(`LibrariesBuilder is emitting`);
        }
        this.emitting = true;
        try {
            for (const libraryBuilder of this.libraryBuilders) {
                const emitFiles = await libraryBuilder.emit();
                this.addEmitFiles(emitFiles);
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
            this.libraries.forEach((libraryBuilder) => {
                libraryBuilder.watch();
            });
        }
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
        if (lib.apiMode !== 'manual') {
            const tsConfigPath = toolkit.path.resolve(lib.rootDir, 'tsconfig.lib.json');
            const tsConfigExists = await this.docgeni.host.pathExists(this.docgeni.paths.getAbsPath(tsConfigPath));
            if (!tsConfigExists) {
                throw new ValidationError(
                    `${lib.name} lib's tsConfigPath(${tsConfigPath}) has not exists, should config it relative to rootDir(${lib.rootDir}) for apiMode: ${lib.apiMode}`,
                );
            }
        }
    }

    private async emitAllEntries() {
        const { moduleKeys, liveExampleComponents } = this.getAllComponentsModulesAndExamples();

        const componentExamplesContent = toolkit.template.compile('component-examples.hbs', {
            data: JSON.stringify(liveExampleComponents, null, 4),
        });
        const componentExamplesPath = toolkit.path.resolve(this.absDestSiteContentPath, 'component-examples.ts');
        await this.docgeni.host.writeFile(componentExamplesPath, componentExamplesContent);
        this.addEmitFile(componentExamplesPath, componentExamplesContent);
        const exampleLoaderContent = toolkit.template.compile('example-loader.hbs', {
            moduleKeys,
            enableIvy: this.docgeni.enableIvy,
        });
        const exampleLoaderPath = toolkit.path.resolve(this.docgeni.paths.absSiteContentPath, 'example-loader.ts');
        await this.docgeni.host.writeFile(exampleLoaderPath, exampleLoaderContent);
        this.addEmitFile(exampleLoaderPath, exampleLoaderContent);
        // generate all modules fallback for below angular 9
        const modules: Array<{
            key: string;
            name: string;
        }> = [];
        for (const key of moduleKeys) {
            modules.push({
                key,
                name: toolkit.strings.pascalCase(key.replace('/', '-')),
            });
        }
        const exampleModulesContent = toolkit.template.compile('example-modules.hbs', {
            modules,
        });
        const exampleModulesPath = toolkit.path.resolve(this.docgeni.paths.absSiteContentPath, 'example-modules.ts');
        await this.docgeni.host.writeFile(exampleModulesPath, exampleModulesContent);
        this.addEmitFile(exampleModulesPath, exampleModulesContent);

        const contentIndexContent = toolkit.template.compile('content-index.hbs', {});
        const contentIndexPath = toolkit.path.resolve(this.docgeni.paths.absSiteContentPath, 'index.ts');
        await this.docgeni.host.writeFile(contentIndexPath, contentIndexContent);
        this.addEmitFile(contentIndexPath, contentIndexContent);
    }

    private getAllComponentsModulesAndExamples(): { moduleKeys: string[]; liveExampleComponents: Record<string, LiveExample> } {
        const moduleKeys: string[] = [];
        const liveExampleComponents: Record<string, LiveExample> = {};
        this.libraryBuilders.forEach((libraryBuilder) => {
            libraryBuilder.components.forEach((component) => {
                // exclude components without examples
                if (!toolkit.utils.isEmpty(component.examples)) {
                    moduleKeys.push(component.getModuleKey());
                    component.examples.forEach((example) => {
                        liveExampleComponents[example.key] = {
                            ...example,
                            sourceFiles: example.sourceFiles.map((sourceFile) => {
                                return {
                                    name: sourceFile.name,
                                    highlightedPath: sourceFile.highlightedPath,
                                };
                            }),
                        };
                    });
                }
            });
        });
        return {
            moduleKeys,
            liveExampleComponents,
        };
    }
}
