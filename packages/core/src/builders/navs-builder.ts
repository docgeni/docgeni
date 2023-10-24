import { toolkit } from '@docgeni/toolkit';
import { DocgeniContext } from '../docgeni.interface';
import { ChannelItem, ComponentDocItem, DocItem, HomeDocMeta, Locale, NavigationItem } from '../interfaces';
import { ascendingSortByOrder, buildNavsMapForLocales, DOCS_ENTRY_FILE_NAMES, getDocTitle, isEntryDoc } from '../utils';
import { DocSourceFile } from './doc-file';
import * as path from 'path';

export class NavsBuilder {
    private localeNavsMap: Record<string, NavigationItem[]> = {};
    /* The navs that generate by docs dir insertion location  */
    private docsNavInsertIndex: number;
    private get config() {
        return this.docgeni.config;
    }
    private rootNavs: NavigationItem[];
    private localesDocsNavsMap: Record<
        string,
        {
            navs: NavigationItem[];
            docItems: DocItem[];
            homeMeta?: HomeDocMeta;
        }
    > = {};

    constructor(private docgeni: DocgeniContext) {}

    public async run() {
        this.setRootNavs();
        this.localeNavsMap = buildNavsMapForLocales(this.config.locales, this.rootNavs);
        await this.build();
        await this.emit();
    }

    public async emit() {
        const localeNavsMap: Record<string, NavigationItem[]> = JSON.parse(JSON.stringify(this.localeNavsMap));
        const localeDocItemsMap: Record<string, DocItem[]> = {};
        for (const locale of this.docgeni.config.locales) {
            const navsForLocale = this.getLocaleDocsNavs(locale.key);
            const docItems = this.getLocaleDocsItems(locale.key);
            localeDocItemsMap[locale.key] = docItems;
            let componentDocItems: ComponentDocItem[] = [];
            localeNavsMap[locale.key].splice(this.docsNavInsertIndex, 0, ...navsForLocale);
            this.docgeni.librariesBuilder.libraries.forEach(libraryBuilder => {
                componentDocItems = componentDocItems.concat(
                    libraryBuilder.generateDocsAndNavsForLocale(locale.key, localeNavsMap[locale.key])
                );
            });

            await this.docgeni.host.writeFile(
                `${this.docgeni.paths.absSiteAssetsContentPath}/navigations-${locale.key}.json`,
                JSON.stringify(
                    {
                        navs: localeNavsMap[locale.key],
                        docs: docItems.concat(componentDocItems),
                        homeMeta: this.localesDocsNavsMap[locale.key].homeMeta
                    },
                    null,
                    2
                )
            );
        }
        await this.docgeni.host.writeFile(
            `${this.docgeni.paths.absSiteContentPath}/navigations.json`,
            JSON.stringify(localeNavsMap, null, 2)
        );
        this.docgeni.hooks.navsEmitSucceed.call(this, localeDocItemsMap);
    }

    private getLocaleDocsNavs(locale: string) {
        return (this.localesDocsNavsMap[locale] && this.localesDocsNavsMap[locale].navs) || [];
    }

    private getLocaleDocsItems(locale: string) {
        return (this.localesDocsNavsMap[locale] && this.localesDocsNavsMap[locale].docItems) || [];
    }

    private async setRootNavs() {
        let navs = this.config.navs;
        let docsNavInsertIndex = navs.indexOf(null);
        if (docsNavInsertIndex >= 0) {
            navs = this.config.navs.filter(item => {
                return !!item;
            });
        } else {
            docsNavInsertIndex = navs.length;
        }
        this.docsNavInsertIndex = docsNavInsertIndex;
        this.rootNavs = navs as NavigationItem[];
    }

    public async build() {
        const localeKeys = this.config.locales.map(locale => {
            return locale.key;
        });

        const localesDocsDataMap: Record<
            string,
            {
                navs: NavigationItem[];
                docItems: DocItem[];
                homeMeta?: HomeDocMeta;
            }
        > = {};
        for (const locale of this.config.locales) {
            const isDefaultLocale = locale.key === this.config.defaultLocale;
            const localeDocsPath = await this.getLocaleDocsPath(locale);
            localesDocsDataMap[locale.key] = {
                navs: [],
                docItems: []
            };
            if (await this.docgeni.host.pathExists(localeDocsPath)) {
                const docItems: DocItem[] = [];
                const { navs, homeMeta } = await this.buildDocDirNavs(
                    localeDocsPath,
                    locale.key,
                    docItems,
                    undefined,
                    isDefaultLocale ? localeKeys : []
                );

                localesDocsDataMap[locale.key] = {
                    navs,
                    docItems,
                    homeMeta
                };

                if (this.docgeni.config.mode === 'full') {
                    docItems.forEach(docItem => {
                        if (docItem.channelPath) {
                            docItem.path = docItem.path.replace(docItem.channelPath + '/', '');
                        }
                    });
                }
            }
        }
        this.localesDocsNavsMap = localesDocsDataMap;
    }

    private async buildDocDirNavs(
        dirPath: string,
        locale: string,
        docItems: DocItem[],
        parentItem?: NavigationItem,
        excludeDirs?: string[]
    ) {
        const dirsAndFiles = await this.docgeni.host.getDirsAndFiles(dirPath, { exclude: excludeDirs });
        let navs: Array<NavigationItem> = [];
        let homeMeta: HomeDocMeta;
        for (const dirname of dirsAndFiles) {
            const absDocPath = toolkit.path.resolve(dirPath, dirname);
            if (await this.docgeni.host.isDirectory(absDocPath)) {
                const entryFile = this.tryGetEntryFile(absDocPath);
                const currentPath = this.getCurrentRoutePath(dirname, entryFile);
                const fullRoutePath = this.getFullRoutePath(currentPath, parentItem);
                const navItem: NavigationItem = {
                    id: fullRoutePath,
                    path: fullRoutePath,
                    channelPath: parentItem ? parentItem.channelPath : fullRoutePath,
                    title: getDocTitle(entryFile && entryFile.meta.title, dirname),
                    subtitle: entryFile && entryFile.meta.subtitle,
                    hidden: entryFile && entryFile.meta.hidden,
                    items: [],
                    order: entryFile && toolkit.utils.isNumber(entryFile.meta.order) ? entryFile.meta.order : Number.MAX_SAFE_INTEGER
                };
                // hide it when hidden is true
                if (!navItem.hidden) {
                    navs.push(navItem);
                }
                const { navs: subNavs } = await this.buildDocDirNavs(absDocPath, locale, docItems, navItem, excludeDirs);
                navItem.items = subNavs;
            } else {
                if (path.extname(absDocPath) !== '.md') {
                    continue;
                }
                const docFile = this.docgeni.docsBuilder.getDoc(absDocPath);
                if (!docFile) {
                    throw new Error(`Can't find doc file for ${absDocPath}`);
                }
                const isEntry = isEntryDoc(docFile.name);
                const isHome = isEntry && !parentItem;
                if (isHome && this.docgeni.config.mode === 'full') {
                    homeMeta = docFile.meta;
                    homeMeta.contentPath = docFile.getRelativeOutputPath();
                    continue;
                }
                if (isEntry && toolkit.utils.isEmpty(docFile.output)) {
                    continue;
                }

                const currentPath = this.getCurrentRoutePath(isEntry ? '' : toolkit.strings.paramCase(docFile.name), docFile);
                const fullRoutePath = this.getFullRoutePath(currentPath, parentItem, isEntry);

                const docItem: NavigationItem = {
                    id: docFile.name,
                    path: fullRoutePath,
                    channelPath: parentItem ? parentItem.channelPath : '',
                    title: getDocTitle(docFile.meta.title, docFile.name),
                    subtitle: docFile.meta.subtitle,
                    order: toolkit.utils.isNumber(docFile.meta.order) ? docFile.meta.order : Number.MAX_SAFE_INTEGER,
                    hidden: docFile.meta.hidden,
                    toc: toolkit.utils.isUndefinedOrNull(docFile.meta.toc) ? this.docgeni.config.toc : docFile.meta.toc,
                    headings: docFile.headings
                };
                docItem.contentPath = docFile.getRelativeOutputPath();
                docItem.originPath = docFile.relative;
                // hide it when hidden is true
                if (!docItem.hidden) {
                    navs.push(docItem);
                    docItems.push(docItem);
                }
            }
        }
        navs = ascendingSortByOrder(navs);
        return { navs, homeMeta };
    }

    private tryGetEntryFile(dirPath: string) {
        const fullPath = DOCS_ENTRY_FILE_NAMES.map(name => {
            return toolkit.path.resolve(dirPath, `${name}.md`);
        }).find(path => {
            return this.docgeni.docsBuilder.getDoc(path);
        });
        if (fullPath) {
            return this.docgeni.docsBuilder.getDoc(fullPath);
        } else {
            return undefined;
        }
    }

    private getFullRoutePath(currentPath: string, parentNav?: NavigationItem, isEntry?: boolean): string {
        if (parentNav && parentNav.path) {
            if (isEntry && currentPath === parentNav.path) {
                return '';
            }
            if (!currentPath || isEntry) {
                return parentNav.path;
            } else {
                return `${parentNav.path}/${currentPath.toLowerCase()}`;
            }
        } else {
            return currentPath;
        }
    }

    private getCurrentRoutePath(dirname: string, file?: DocSourceFile) {
        let currentPath = dirname;
        if (file && !toolkit.utils.isUndefinedOrNull(file.meta.path)) {
            currentPath = file.meta.path;
        }
        return currentPath;
    }

    private async getLocaleDocsPath(locale: Locale) {
        const isDefaultLocale = locale.key === this.config.defaultLocale;
        if (isDefaultLocale) {
            const dir = toolkit.path.resolve(this.docgeni.paths.absDocsPath, locale.key);
            if (await this.docgeni.host.pathExists(dir)) {
                return dir;
            }
        }
        return isDefaultLocale ? this.docgeni.paths.absDocsPath : toolkit.path.resolve(this.docgeni.paths.absDocsPath, locale.key);
    }
}
