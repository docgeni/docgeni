import { DocgeniContext } from '../docgeni.interface';
import { CategoryItem, ChannelItem, ComponentDocItem, ExampleSourceFile, Library, LiveExample, NavigationItem } from '../interfaces';
import { toolkit } from '@docgeni/toolkit';
import { ASSETS_API_DOCS_RELATIVE_PATH, ASSETS_EXAMPLES_HIGHLIGHTED_RELATIVE_PATH, ASSETS_OVERVIEWS_RELATIVE_PATH } from '../constants';
import { ascendingSortByOrder, getItemLocaleProperty } from '../utils';

import { AsyncSeriesHook, SyncHook } from 'tapable';
import { LibComponent } from './library-component';
import { resolve } from '../fs';

export class LibraryBuilder {
    private absLibPath: string;
    private absDestSiteContentComponentsPath: string;
    private absDestAssetsExamplesHighlightedPath: string;
    private absDestAssetsOverviewsPath: string;
    private absDestAssetsApiDocsPath: string;
    private localeCategoriesMap: Record<string, CategoryItem[]> = {};
    private componentsMap = new Map<string, LibComponent>();

    public hooks = {
        build: new AsyncSeriesHook<LibraryBuilder>(['libraryBuilder']),
        buildSucceed: new SyncHook<LibraryBuilder>(['libraryBuilder']),
        buildComponent: new SyncHook<LibComponent>(['component']),
        buildComponentSucceed: new SyncHook<LibComponent>(['component'])
    };

    constructor(private docgeni: DocgeniContext, public lib: Library) {
        this.absLibPath = resolve(this.docgeni.paths.cwd, lib.rootDir);
        this.absDestSiteContentComponentsPath = resolve(this.docgeni.paths.absSiteContentPath, `components/${this.lib.name}`);
        this.absDestAssetsExamplesHighlightedPath = resolve(
            this.docgeni.paths.absSitePath,
            `${ASSETS_EXAMPLES_HIGHLIGHTED_RELATIVE_PATH}/${this.lib.name}`
        );
        this.absDestAssetsOverviewsPath = resolve(this.docgeni.paths.absSitePath, `${ASSETS_OVERVIEWS_RELATIVE_PATH}/${this.lib.name}`);
        this.absDestAssetsApiDocsPath = resolve(this.docgeni.paths.absSitePath, `${ASSETS_API_DOCS_RELATIVE_PATH}/${this.lib.name}`);
    }

    public get components() {
        return this.componentsMap;
    }

    public async initialize(): Promise<void> {
        const components: LibComponent[] = [];
        const includes = this.lib.include ? toolkit.utils.coerceArray(this.lib.include) : [];
        for (const include of includes) {
            const includeAbsPath = resolve(this.absLibPath, include);
            const dirExists = await this.docgeni.host.pathExists(includeAbsPath);
            if (dirExists) {
                const subDirs = await this.docgeni.host.getDirs(includeAbsPath, { exclude: this.lib.exclude });
                subDirs.forEach(dir => {
                    const absComponentPath = resolve(includeAbsPath, dir);
                    const component = new LibComponent(this.docgeni, this.lib, dir, absComponentPath);
                    this.componentsMap.set(absComponentPath, component);
                });
            }
        }

        // 比如示例中的 common/zoo, 那么 common 文件夹不是一个组件
        const excludes = this.lib.exclude ? toolkit.utils.coerceArray(this.lib.exclude) : [];
        const dirs = await this.docgeni.host.getDirs(this.absLibPath, { exclude: [...excludes] });
        dirs.forEach(dir => {
            const absComponentPath = resolve(this.absLibPath, dir);
            const component = new LibComponent(this.docgeni, this.lib, dir, absComponentPath);
            components.push(component);
            this.componentsMap.set(absComponentPath, component);
        });
    }

    public async build(): Promise<void> {
        this.buildLocaleCategoriesMap(this.lib.categories);
        for (const component of this.componentsMap.values()) {
            this.hooks.buildComponent.call(component);
            await component.build();
            this.hooks.buildComponentSucceed.call(component);
        }
        this.docgeni.logger.success(`Lib: ${this.lib.name} compiled successfully`);
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

    public async emit(): Promise<void> {
        for (const component of this.componentsMap.values()) {
            await component.emit(
                this.absDestAssetsOverviewsPath,
                this.absDestAssetsApiDocsPath,
                this.absDestSiteContentComponentsPath,
                this.absDestAssetsExamplesHighlightedPath
            );
        }
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
