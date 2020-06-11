import { DocgeniContext, DocSourceFile, ComponentDocMeta } from './docgeni.interface';
import { Library, CategoryItem, LiveExample, ExampleSourceFile } from './interfaces';
import { toolkit, fs } from '@docgeni/toolkit';
import * as path from 'path';
import { DocType } from './enums';
import {
    ASSETS_EXAMPLES_SOURCE_RELATIVE_PATH,
    ASSETS_EXAMPLES_OVERVIEWS_RELATIVE_PATH,
    ASSETS_EXAMPLES_HIGHLIGHTED_RELATIVE_PATH
} from './constants';
import { getItemLocaleProperty, createDocSourceFile, highlight } from './utils';

export interface LibComponent {
    name: string;
    absPath: string;
    meta?: ComponentDocMeta;
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
    private componentLiveExamples: Map<string, LiveExample[]> = new Map();
    private liveExampleComponents: { [key: string]: LiveExample } = {};

    constructor(private docgeni: DocgeniContext) {
        this.absDestSiteContentPath = docgeni.paths.absSiteContentPath;
    }

    addExamples(key: string, examples: LiveExample[] = []) {
        if (!toolkit.utils.isEmpty(examples)) {
            this.componentLiveExamples.set(key, examples);
            examples.forEach(example => {
                this.liveExampleComponents[example.key] = example;
            });
        }
    }

    emit() {
        toolkit.template.generate('component-examples.hbs', path.resolve(this.absDestSiteContentPath, 'component-examples.ts'), {
            data: JSON.stringify(this.liveExampleComponents, null, 4)
        });
        const moduleKeys = this.componentLiveExamples.keys();
        toolkit.template.generate('example-loader.hbs', path.resolve(this.docgeni.paths.absSiteContentPath, 'example-loader.ts'), {
            moduleKeys
        });
    }
}

export class LibraryCompiler {
    private absLibPath: string;
    private absDestSiteContentComponentsPath: string;
    private absDestAssetsExamplesSourcePath: string;
    private absDestAssetsExamplesHighlightedPath: string;
    private absDestAssetsExamplesOverviewPath: string;
    private examplesEmitter: ExamplesEmitter;
    private localesCategoriesMap: LocaleCategoryMap;

    constructor(private docgeni: DocgeniContext, public lib: Library, examplesEmitter: ExamplesEmitter) {
        this.absLibPath = this.docgeni.paths.getAbsPath(this.lib.rootDir);
        this.absDestSiteContentComponentsPath = path.resolve(this.docgeni.paths.absSiteContentPath, `components/${this.lib.name}`);
        this.absDestAssetsExamplesSourcePath = path.resolve(
            this.docgeni.paths.absSitePath,
            `${ASSETS_EXAMPLES_SOURCE_RELATIVE_PATH}/${this.lib.name}`
        );
        this.absDestAssetsExamplesHighlightedPath = path.resolve(
            this.docgeni.paths.absSitePath,
            `${ASSETS_EXAMPLES_HIGHLIGHTED_RELATIVE_PATH}/${this.lib.name}`
        );
        this.absDestAssetsExamplesOverviewPath = path.resolve(
            this.docgeni.paths.absSitePath,
            `${ASSETS_EXAMPLES_OVERVIEWS_RELATIVE_PATH}/${this.lib.name}`
        );
        this.examplesEmitter = examplesEmitter;
    }

    getAbsLibPath() {
        return this.absLibPath;
    }

    getLocaleCategories(locale: string) {
        return this.localesCategoriesMap[locale] && this.localesCategoriesMap[locale].categories;
    }

    async compile(): Promise<LocaleCategoryMap> {
        const components = await this.getComponents();

        this.localesCategoriesMap = this.buildLocalesCategoriesMap(this.lib.categories);

        // const examplesEmitter = new ExamplesEmitter(this.docgeni);
        for await (const component of components) {
            // Component Doc
            const { meta, localeDocsMap } = await this.compileComponentDocs(component);
            // Examples
            const examples = await this.generateComponentExamples(component);
            this.examplesEmitter.addExamples(`${this.lib.name}/${component.name}`, examples);
            component.meta = meta;

            this.docgeni.config.locales.forEach(locale => {
                const localeCategories = this.localesCategoriesMap[locale.key];
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
                const title = docSourceFile ? docSourceFile.result.meta.title : toolkit.strings.titleCase(component.name);
                const subtitle = docSourceFile ? docSourceFile.result.meta.subtitle : '';

                if (docSourceFile || !toolkit.utils.isEmpty(examples)) {
                    category.items.push({
                        id: component.name,
                        title,
                        subtitle,
                        path: component.name,
                        importSpecifier: `${this.lib.name}/${component.name}`,
                        examples: examples.map(example => example.key),
                        overview: docSourceFile && docSourceFile.result.html ? true : false
                    });
                }
            });
        }
        this.docgeni.logger.succuss(`Lib(${this.lib.name}) compiled successfully`);
        return this.localesCategoriesMap;
    }

    private match(exclude: string | string[], target: string) {
        const excludeArray = toolkit.utils.coerceArray(exclude);
        const matchExclude = excludeArray.find(item => {
            return toolkit.utils.matchGlob(target, item);
        });
        return matchExclude ? false : true;
    }

    private async getComponents(): Promise<LibComponent[]> {
        const dirs = await toolkit.fs.getDirs(this.absLibPath);
        return dirs
            .filter(dir => {
                return this.lib.exclude ? this.match(this.lib.exclude, dir) : true;
            })
            .map(dir => {
                const absComponentPath = path.resolve(this.absLibPath, dir);
                return {
                    name: dir,
                    absPath: absComponentPath
                };
            });
    }

    private async compileComponentDocs(
        component: LibComponent
    ): Promise<{
        meta: ComponentDocMeta;
        localeDocsMap: Record<string, DocSourceFile>;
    }> {
        const absComponentDocPath = path.resolve(component.absPath, 'doc');
        const docSourceFiles: DocSourceFile[] = [];
        const destAbsExamplesOverviewPath = path.resolve(this.absDestAssetsExamplesOverviewPath, `${component.name}`);

        const localeDocsMap: { [key: string]: DocSourceFile } = {};
        let meta: Partial<ComponentDocMeta> = {};
        for (const locale of this.docgeni.config.locales) {
            const absDocPath = path.resolve(absComponentDocPath, `${locale.key}.md`);
            if (await toolkit.fs.pathExists(absDocPath)) {
                const content = await toolkit.fs.readFile(absDocPath, 'UTF-8');
                const docSourceFile = createDocSourceFile(absDocPath, content, DocType.component);
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
            meta: meta as ComponentDocMeta
        };
    }

    private getLibAbbrName(lib: Library) {
        return lib.abbrName || lib.name;
    }

    private async generateComponentExamples(component: LibComponent) {
        const absComponentExamplesPath = path.resolve(component.absPath, 'examples');
        const destAbsComponentExamplesPath = path.resolve(this.absDestSiteContentComponentsPath, `${component.name}`);
        const destAbsAssetsExamplesSourcePath = path.resolve(this.absDestAssetsExamplesSourcePath, `${component.name}`);
        if (!(await toolkit.fs.pathExists(absComponentExamplesPath))) {
            return [];
        }
        await toolkit.fs.copy(absComponentExamplesPath, destAbsComponentExamplesPath);
        await toolkit.fs.copy(absComponentExamplesPath, destAbsAssetsExamplesSourcePath);

        const dirs = await toolkit.fs.getDirs(absComponentExamplesPath);
        const examples: LiveExample[] = [];
        const moduleName = toolkit.strings.pascalCase(`${this.getLibAbbrName(this.lib)}-${component.name}-examples-module`);

        for (const dirName of dirs) {
            const key = `${this.getLibAbbrName(this.lib)}-${component.name}-${dirName}-example`;
            const componentName = toolkit.strings.pascalCase(`${key}-component`);
            const absComponentExamplePath = path.resolve(absComponentExamplesPath, dirName);
            const sourceFiles = await this.generateComponentExampleHighlighted(component, absComponentExamplePath, dirName);
            examples.push({
                key,
                name: dirName,
                title: toolkit.strings.pascalCase(dirName),
                componentName,
                module: {
                    name: moduleName,
                    importSpecifier: `${this.lib.name}/${component.name}`
                },
                sourceFiles,
                additionalFiles: [],
                additionalComponents: []
            });
        }

        toolkit.template.generate('component-examples-entry.hbs', path.resolve(destAbsComponentExamplesPath, 'index.ts'), {
            examples,
            examplesModule: moduleName
        });
        return examples;
    }

    private async generateComponentExampleHighlighted(
        component: LibComponent,
        absComponentExamplePath: string,
        exampleName: string
    ): Promise<ExampleSourceFile[]> {
        const files = await toolkit.fs.getFiles(absComponentExamplePath);
        const absExampleHighlightPath = path.resolve(this.absDestAssetsExamplesHighlightedPath, component.name, exampleName);
        const exampleSourceFiles: ExampleSourceFile[] = [];
        for (const fileName of files) {
            const ext = toolkit.utils.extractExtname(fileName, true);
            const sourceCode = await toolkit.fs.readFileContent(path.resolve(absComponentExamplePath, fileName));
            const highlightedSourceCode = highlight(sourceCode, ext);
            const destFileName = `${toolkit.strings.paramCase(fileName)}.html`;
            const destHighlightedSourceFilePath = `${absExampleHighlightPath}/${destFileName}`;
            await toolkit.fs.ensureWriteFile(destHighlightedSourceFilePath, highlightedSourceCode);
            exampleSourceFiles.push({
                name: fileName,
                highlightedPath: destFileName
            });
        }

        return exampleSourceFiles;
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
