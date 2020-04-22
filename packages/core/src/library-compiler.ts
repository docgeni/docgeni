import { DocgeniContext, DocSourceFile } from './docgeni.interface';
import { Library, CategoryItem, LiveExample } from './interfaces';
import { toolkit } from '@docgeni/toolkit';
import * as path from 'path';
import { DocType } from './enums';
import * as ts from 'typescript';
import { Project } from 'ts-morph';

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
    private examplesEmitter: ExamplesEmitter;
    constructor(private docgeni: DocgeniContext, private lib: Library, examplesEmitter: ExamplesEmitter) {
        this.absLibPath = this.docgeni.getAbsPath(this.lib.rootPath);
        this.absDestSiteContentComponentsPath = path.resolve(this.docgeni.paths.absSiteContentPath, `components/${this.lib.name}`);
        this.absDestExamplesSourceAssetsPath = path.resolve(this.docgeni.paths.absSitePath, `src/assets/examples-source/${this.lib.name}`);
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

    async compileComponentDoc(component: LibComponent) {
        const absComponentDocPath = path.resolve(component.absPath, 'doc');
        const absComponentDocZHPath = path.resolve(absComponentDocPath, 'zh-cn.md');
        const absComponentDocENPath = path.resolve(absComponentDocPath, 'en-us.md');
        const content = await toolkit.fs.readFile(absComponentDocZHPath, 'UTF-8');
        const absDocPath = absComponentDocZHPath;
        // TODO:: locales support
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
        return docSourceFile;
    }

    async compile(): Promise<CategoryItem[]> {
        const components = await this.getComponents();

        const groups: CategoryItem[] = this.lib.categories;
        const groupsMap: { [key: string]: CategoryItem } = toolkit.utils.keyBy(groups, 'id');

        // const examplesEmitter = new ExamplesEmitter(this.docgeni);
        for (const component of components) {
            // Component Doc
            const docSource = await this.compileComponentDoc(component);

            // Examples
            const examples = await this.generateComponentExamples(component);
            this.examplesEmitter.addExamples(`${this.lib.name}/${component.name}`, examples);
            component.meta = docSource.result.meta;
            let group = groupsMap[component.meta.category];
            // Group 不存在，根据文档中配置的 Title 动态添加
            if (!group) {
                group = {
                    id: component.meta.category,
                    title: component.meta.category,
                    items: []
                };
                groupsMap[component.meta.category] = group;
                groups.push(group);
            }
            group.items = group.items || [];
            group.items.push({
                id: component.name,
                title: component.meta.title,
                subtitle: component.meta.subtitle,
                path: component.name,
                content: docSource.content,
                examples: examples.map(example => example.key)
            });
        }
        return groups;
    }

    private async generateComponentExamples(component: LibComponent) {
        const absComponentExamplesPath = path.resolve(component.absPath, 'examples');
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
                title: dir,
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
}
