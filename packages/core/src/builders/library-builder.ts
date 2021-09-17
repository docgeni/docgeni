import { DocgeniContext } from '../docgeni.interface';
import { CategoryItem, ChannelItem, ComponentDocItem, ExampleSourceFile, Library, LiveExample, NavigationItem } from '../interfaces';
import { toolkit } from '@docgeni/toolkit';
import { ASSETS_API_DOCS_RELATIVE_PATH, ASSETS_EXAMPLES_HIGHLIGHTED_RELATIVE_PATH, ASSETS_OVERVIEWS_RELATIVE_PATH } from '../constants';
import { ascendingSortByOrder, getItemLocaleProperty } from '../utils';

import { AsyncSeriesHook, SyncHook } from 'tapable';
import { LibraryComponentImpl } from './library-component';
import { HostWatchEventType, resolve } from '../fs';
import { EmitFile, EmitFiles, LibraryBuilder, LibraryComponent } from '../types';
import { FileEmitter } from './emitter';

export class LibraryBuilderImpl extends FileEmitter implements LibraryBuilder {
    private absLibPath: string;
    private absDestSiteContentComponentsPath: string;
    private absDestAssetsExamplesHighlightedPath: string;
    private absDestAssetsOverviewsPath: string;
    private absDestAssetsApiDocsPath: string;
    private localeCategoriesMap: Record<string, CategoryItem[]> = {};
    private componentsMap = new Map<string, LibraryComponent>();

    constructor(private docgeni: DocgeniContext, public lib: Library) {
        super();
        this.absLibPath = resolve(this.docgeni.paths.cwd, lib.rootDir);
        this.absDestSiteContentComponentsPath = resolve(this.docgeni.paths.absSiteContentPath, `components/${this.lib.name}`);
        this.absDestAssetsExamplesHighlightedPath = resolve(
            this.docgeni.paths.absSitePath,
            `${ASSETS_EXAMPLES_HIGHLIGHTED_RELATIVE_PATH}/${this.lib.name}`
        );
        this.absDestAssetsOverviewsPath = resolve(this.docgeni.paths.absSitePath, `${ASSETS_OVERVIEWS_RELATIVE_PATH}/${this.lib.name}`);
        this.absDestAssetsApiDocsPath = resolve(this.docgeni.paths.absSitePath, `${ASSETS_API_DOCS_RELATIVE_PATH}/${this.lib.name}`);
    }

    public get components(): Map<string, LibraryComponent> {
        return this.componentsMap;
    }

    public async initialize(): Promise<void> {
        this.buildLocaleCategoriesMap(this.lib.categories);

        const components: LibraryComponentImpl[] = [];
        const includes = this.lib.include ? toolkit.utils.coerceArray(this.lib.include) : [];
        for (const include of includes) {
            const includeAbsPath = resolve(this.absLibPath, include);
            const dirExists = await this.docgeni.host.pathExists(includeAbsPath);
            if (dirExists) {
                const subDirs = await this.docgeni.host.getDirs(includeAbsPath, { exclude: this.lib.exclude });
                subDirs.forEach(dir => {
                    const absComponentPath = resolve(includeAbsPath, dir);
                    const component = new LibraryComponentImpl(this.docgeni, this.lib, dir, absComponentPath);
                    this.componentsMap.set(absComponentPath, component);
                });
            }
        }

        // 比如示例中的 common/zoo, 那么 common 文件夹不是一个组件
        const excludes = this.lib.exclude ? toolkit.utils.coerceArray(this.lib.exclude) : [];
        const dirs = await this.docgeni.host.getDirs(this.absLibPath, { exclude: [...excludes] });
        dirs.forEach(dir => {
            const absComponentPath = resolve(this.absLibPath, dir);
            const component = new LibraryComponentImpl(this.docgeni, this.lib, dir, absComponentPath);
            components.push(component);
            this.componentsMap.set(absComponentPath, component);
        });
    }

    public async build(components: LibraryComponent[] = Array.from(this.componentsMap.values())): Promise<void> {
        this.resetEmitted();
        this.docgeni.hooks.libraryBuild.call(this, components);
        for (const component of components) {
            await this.buildComponent(component);
        }
        this.docgeni.hooks.libraryBuildSucceed.call(this, components);
    }

    public async onEmit(): Promise<void> {
        for (const component of this.componentsMap.values()) {
            const componentEmitFiles = await component.emit();
            this.addEmitFiles(componentEmitFiles);
        }
    }

    public watch() {
        if (!this.docgeni.watch) {
            return;
        }
        const watchedDirs: string[] = [];
        const componentDirs = [];
        const dirToComponent: Record<string, LibraryComponent> = {};
        for (const [key, component] of this.components) {
            componentDirs.push(key);
            dirToComponent[key] = component;
            watchedDirs.push(component.absDocPath);
            watchedDirs.push(component.absApiPath);
            watchedDirs.push(component.absExamplesPath);
        }
        this.docgeni.host.watchAggregated(watchedDirs).subscribe(async changes => {
            const changeComponents = new Map<string, LibraryComponent>();
            changes.forEach(change => {
                const componentDir = componentDirs.find(componentDir => {
                    return change.path.startsWith(componentDir + '/');
                });
                if (componentDir && dirToComponent[componentDir]) {
                    changeComponents.set(componentDir, dirToComponent[componentDir]);
                }
            });
            if (changeComponents.size > 0) {
                this.docgeni.compile({
                    libraryBuilder: this,
                    libraryComponents: Array.from(changeComponents.values()),
                    changes: changes
                });
            }
        });
    }

    public generateLocaleNavs(locale: string, rootNavs: NavigationItem[]): ComponentDocItem[] {
        let channel: ChannelItem = rootNavs.find(nav => {
            return nav.lib === this.lib.name;
        });
        const categories: CategoryItem[] = JSON.parse(JSON.stringify(this.localeCategoriesMap[locale]));
        if (channel) {
            channel.items = categories;
        } else {
            // can't find channel from navs in config, generate a channel
            channel = {
                id: this.lib.name,
                lib: this.lib.name,
                path: this.lib.name,
                title: toolkit.strings.titleCase(this.lib.name),
                items: categories
            };
            // rootNavs.push(channel as NavigationItem);
        }
        const categoriesMap = toolkit.utils.keyBy(categories, 'id');
        const docItems: ComponentDocItem[] = [];
        for (const component of this.componentsMap.values()) {
            const docItem = component.getDocItem(locale);
            if (docItem && !docItem.hidden) {
                if (this.docgeni.config.mode === 'lite') {
                    docItem.path = `${channel.path}/${docItem.path}`;
                }
                if (categoriesMap[docItem.category]) {
                    categoriesMap[docItem.category].items.push(docItem);
                } else {
                    channel.items.push(docItem);
                }
                docItems.push(docItem);
            }
        }
        channel.items.forEach((category: CategoryItem) => {
            if (category.items) {
                category.items = ascendingSortByOrder(category.items);
            }
        });
        return docItems;
    }

    private async buildComponent(component: LibraryComponent) {
        this.docgeni.hooks.componentBuild.call(component);
        await component.build();
        this.docgeni.hooks.componentBuildSucceed.call(component);
    }

    private buildLocaleCategoriesMap(categories: CategoryItem[]): void {
        const localeCategories: Record<string, CategoryItem[]> = {};
        this.docgeni.config.locales.forEach(locale => {
            localeCategories[locale.key] = [];
        });

        categories.forEach(rawCategory => {
            this.docgeni.config.locales.forEach(locale => {
                const category: CategoryItem = {
                    id: rawCategory.id,
                    title: getItemLocaleProperty(rawCategory, locale.key, 'title'),
                    subtitle: getItemLocaleProperty(rawCategory, locale.key, 'subtitle'),
                    items: []
                };
                localeCategories[locale.key].push(category);
            });
        });
        this.localeCategoriesMap = localeCategories;
    }
}
