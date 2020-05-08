import { DocgeniContext, DocSourceFile, DocComponentMeta } from './docgeni.interface';
import { Library, CategoryItem, LiveExample } from './interfaces';
import { toolkit, fs } from '@docgeni/toolkit';
import * as path from 'path';
import { DocType } from './enums';
import { EXAMPLES_SOURCE_RELATIVE_PATH, EXAMPLES_OVERVIEWS_RELATIVE_PATH } from './constants';
import { getItemLocaleProperty } from './utils';

export interface LibComponent {
    name: string;
    absPath: string;
    meta?: {
        category: string;
        title: string;
        subtitle: string;
        description?: string;
    };
}

export type LocaleCategoryMap = Record<
    string,
    {
        categories: CategoryItem[];
        categoriesMap: Record<string, CategoryItem>;
    }
>;

export class ExamplesEmitter {
    private absDestSiteContentPath: string;
    private absDestExamplesSourceAssetsPath: string;
    private componentLiveExamples: Map<string, LiveExample[]> = new Map();
    private liveExampleComponents: { [key: string]: LiveExample } = {};

    constructor(private docgeni: DocgeniContext) {
        this.absDestSiteContentPath = docgeni.paths.absSiteContentPath;
    }

    addExamples(key: string, examples: LiveExample[]) {
        this.componentLiveExamples.set(key, examples);
        examples.forEach(example => {
            this.liveExampleComponents[example.key] = example;
        });
    }

    emit() {
        toolkit.template.generate('component-examples.hbs', path.resolve(this.absDestSiteContentPath, 'component-examples.ts'), {
            data: JSON.stringify(this.liveExampleComponents, null, 4)
        });
        const moduleKeys = [];
        this.componentLiveExamples.forEach((value, key) => {
            moduleKeys.push(key);
        });
        toolkit.template.generate('example-loader.hbs', path.resolve(this.docgeni.paths.absSiteContentPath, 'example-loader.ts'), {
            moduleKeys
        });
    }
}

export class LibraryCompiler {
    private absLibPath: string;
    private absDestSiteContentComponentsPath: string;
    private absDestExamplesSourceAssetsPath: string;
    private absDestExamplesOverviewAssetsPath: string;
    private examplesEmitter: ExamplesEmitter;

    constructor(private docgeni: DocgeniContext, private lib: Library, examplesEmitter: ExamplesEmitter) {
        this.absLibPath = this.docgeni.getAbsPath(this.lib.rootPath);
        this.absDestSiteContentComponentsPath = path.resolve(this.docgeni.paths.absSiteContentPath, `components/${this.lib.name}`);
        this.absDestExamplesSourceAssetsPath = path.resolve(
            this.docgeni.paths.absSitePath,
            `${EXAMPLES_SOURCE_RELATIVE_PATH}/${this.lib.name}`
        );
        this.absDestExamplesOverviewAssetsPath = path.resolve(
            this.docgeni.paths.absSitePath,
            `${EXAMPLES_OVERVIEWS_RELATIVE_PATH}/${this.lib.name}`
        );
        this.examplesEmitter = examplesEmitter;
    }

    private async getComponents(): Promise<LibComponent[]> {
        const dirs = await toolkit.fs.readdir(this.absLibPath);
        const components: LibComponent[] = [];
        dirs.forEach(dir => {
            const absComponentPath = path.resolve(this.absLibPath, dir);
            if (toolkit.fs.isDirectory(absComponentPath)) {
                components.push({
                    name: dir,
                    absPath: absComponentPath
                });
            }
        });
        return components;
    }

    async compileComponentDocs(
        component: LibComponent
    ): Promise<{
        meta: DocComponentMeta;
        localeDocsMap: Record<string, DocSourceFile>;
    }> {
        const absComponentDocPath = path.resolve(component.absPath, 'doc');
        const docSourceFiles: DocSourceFile[] = [];
        const destAbsExamplesOverviewPath = path.resolve(this.absDestExamplesOverviewAssetsPath, `${component.name}`);

        const localeDocsMap: { [key: string]: DocSourceFile } = {};
        let meta: Partial<DocComponentMeta> = {};
        for (const locale of this.docgeni.config.locales) {
            const absDocPath = path.resolve(absComponentDocPath, `${locale.key}.md`);
            if (await toolkit.fs.pathExists(absDocPath)) {
                const content = await toolkit.fs.readFile(absDocPath, 'UTF-8');
                const docSourceFile: DocSourceFile = {
                    absPath: absDocPath,
                    content,
                    dirname: path.dirname(absDocPath),
                    ext: path.extname(absDocPath),
                    basename: path.basename(absDocPath),
                    docType: DocType.component,
                    result: null
                };
                this.docgeni.hooks.docCompile.call(docSourceFile);
                docSourceFiles.push(docSourceFile);
                localeDocsMap[locale.key] = docSourceFile;
                // Use Default Locale meta
                if (locale.key === this.docgeni.config.defaultLocale) {
                    meta = {
                        category: docSourceFile.result.meta.category,
                        order: docSourceFile.result.meta.order
                    };
                }
                const filePath = path.resolve(destAbsExamplesOverviewPath, `${locale.key}.html`);
                await toolkit.fs.ensureWriteFile(filePath, docSourceFile.result.html);
            }
        }
        return {
            localeDocsMap,
            meta: meta as DocComponentMeta
        };
    }

    async compile(): Promise<LocaleCategoryMap> {
        const components = await this.getComponents();

        const localesCategoriesMap: LocaleCategoryMap = this.buildLocalesCategoriesMap(this.lib.categories);

        // const examplesEmitter = new ExamplesEmitter(this.docgeni);
        for (const component of components) {
            // Component Doc
            const { meta, localeDocsMap } = await this.compileComponentDocs(component);
            // Examples
            const examples = await this.generateComponentExamples(component);
            this.examplesEmitter.addExamples(`${this.lib.name}/${component.name}`, examples);
            component.meta = meta;

            this.docgeni.config.locales.forEach(locale => {
                const localeCategories = localesCategoriesMap[locale.key];
                let category = localeCategories.categoriesMap[meta.category];
                let docSourceFile = localeDocsMap[locale.key];
                // Use default locale's data when locale is not found
                if (!docSourceFile) {
                    docSourceFile = localeDocsMap[this.docgeni.config.defaultLocale];
                }
                // category 不存在，根据文档中配置的 Title 动态添加
                if (!localeCategories.categoriesMap[meta.category]) {
                    category = {
                        id: meta.category,
                        title: meta.title,
                        subtitle: meta.subtitle,
                        items: []
                    };
                    localeCategories.categories.push(category);
                    localeCategories.categoriesMap[meta.category] = category;
                }
                category.items.push({
                    id: component.name,
                    title: docSourceFile.result.meta.title,
                    subtitle: docSourceFile.result.meta.subtitle,
                    path: component.name,
                    importSpecifier: `${this.lib.name}/${component.name}`,
                    examples: examples.map(example => example.key)
                });
            });
        }
        return localesCategoriesMap;
    }

    private async generateComponentExamples(component: LibComponent) {
        const absComponentExamplesPath = path.resolve(component.absPath, 'examples');
        const absComponentDocPath = path.resolve(component.absPath, 'doc');
        const destAbsComponentExamplesPath = path.resolve(this.absDestSiteContentComponentsPath, `${component.name}`);
        const destAbsExamplesSourceAssetsPath = path.resolve(this.absDestExamplesSourceAssetsPath, `${component.name}`);
        await toolkit.fs.copy(absComponentExamplesPath, destAbsComponentExamplesPath);
        await toolkit.fs.copy(absComponentExamplesPath, destAbsExamplesSourceAssetsPath);

        const dirs = await toolkit.fs.getDirs(absComponentExamplesPath);
        const examples: LiveExample[] = [];
        const moduleName = toolkit.strings.pascalCase(`${this.lib.name}-${component.name}-examples-module`);

        dirs.forEach(dir => {
            const key = `${this.lib.name}-${component.name}-${dir}-example`;
            const componentName = toolkit.strings.pascalCase(`${this.lib.name}-${component.name}-${dir}-example-component`);
            examples.push({
                key,
                name: dir,
                title: toolkit.strings.pascalCase(dir),
                componentName,
                module: {
                    name: moduleName,
                    importSpecifier: `${this.lib.name}/${component.name}`
                },
                additionalFiles: [],
                additionalComponents: []
            });
        });

        toolkit.template.generate('component-examples-entry.hbs', path.resolve(destAbsComponentExamplesPath, 'index.ts'), {
            examples,
            examplesModule: moduleName
        });
        return examples;
    }

    private buildLocalesCategoriesMap(categories: CategoryItem[]): LocaleCategoryMap {
        const localeCategories: Record<
            string,
            {
                categories: CategoryItem[];
                categoriesMap: Record<string, CategoryItem>;
            }
        > = {};
        this.docgeni.config.locales.forEach(locale => {
            localeCategories[locale.key] = {
                categories: [],
                categoriesMap: {}
            };
        });

        categories.forEach(rawCategory => {
            this.docgeni.config.locales.forEach(locale => {
                const category: CategoryItem = {
                    id: rawCategory.id,
                    title: getItemLocaleProperty(rawCategory, locale.key, 'title'),
                    subtitle: getItemLocaleProperty(rawCategory, locale.key, 'subtitle'),
                    items: []
                };
                localeCategories[locale.key].categories.push(category);
                localeCategories[locale.key].categoriesMap[category.id] = category;
            });
        });
        return localeCategories;
    }
}
