import { toolkit } from '@docgeni/toolkit';
import { DocgeniContext } from '../../docgeni.interface';
import { ComponentDocItem, DocItem, HomeDocMeta, Locale, NavigationItem } from '../../interfaces';
import { ascendingSortByOrder, DOCS_ENTRY_FILE_NAMES, getDocTitle, isEntryDoc } from '../../utils';
import { DocSourceFile } from '../doc-file';
import { ConfigNavsPreparer } from './config-navs-preparer';
import { mergeDocsNavs } from './docs-nav-merger';
import { LocaleNavigationArtifact } from './navigation-types';
import * as path from 'path';

export class NavsBuilder {
    private configNavsPreparer?: ConfigNavsPreparer;
    private navigationArtifact: Record<string, LocaleNavigationArtifact> = {};

    private get config() {
        return this.docgeni.config;
    }

    constructor(private docgeni: DocgeniContext) {}

    public async run() {
        await this.build();
        await this.emit();
    }

    public async emit() {
        const navsByLocale: Record<string, NavigationItem[]> = {};
        const docItemsByLocale: Record<string, DocItem[]> = {};

        for (const localeKey of Object.keys(this.navigationArtifact)) {
            const artifact = this.navigationArtifact[localeKey];
            navsByLocale[localeKey] = artifact.navs;
            docItemsByLocale[localeKey] = artifact.docs;

            await this.docgeni.host.writeFile(
                `${this.docgeni.paths.absSiteAssetsContentPath}/navigations-${localeKey}.json`,
                JSON.stringify(
                    {
                        navs: artifact.navs,
                        docs: artifact.docs,
                        homeMeta: artifact.homeMeta,
                    },
                    null,
                    2,
                ),
            );
        }

        await this.docgeni.host.writeFile(
            `${this.docgeni.paths.absSiteContentPath}/navigations.json`,
            JSON.stringify(navsByLocale, null, 2),
        );

        this.docgeni.hooks.navsEmitSucceed.call(this, docItemsByLocale);
    }

    private prepareConfigNavs() {
        this.configNavsPreparer = new ConfigNavsPreparer(this.config.locales);
        this.configNavsPreparer.prepare(this.config.navs as Array<NavigationItem | null>);
    }

    private ensureConfigNavsPrepared() {
        if (!this.configNavsPreparer) {
            this.prepareConfigNavs();
        }
    }

    public async build() {
        this.ensureConfigNavsPrepared();
        this.navigationArtifact = {};

        const localeKeys = this.config.locales.map((locale) => locale.key);

        for (const locale of this.config.locales) {
            const artifact: LocaleNavigationArtifact = {
                locale: locale.key,
                navs: [],
                docs: [],
            };

            const isDefaultLocale = locale.key === this.config.defaultLocale;
            const localeDocsPath = await this.getLocaleDocsPath(locale);
            const configNavs = this.configNavsPreparer!.cloneNavsForLocale(locale.key);
            if (await this.docgeni.host.pathExists(localeDocsPath)) {
                const { navs: docsNavs, homeMeta } = await this.buildLocalNavs(
                    localeDocsPath,
                    artifact.docs,
                    isDefaultLocale ? localeKeys : [],
                );
                artifact.navs = mergeDocsNavs(configNavs, docsNavs, this.configNavsPreparer!.docsNavInsertIndex);
                artifact.homeMeta = homeMeta;
            } else {
                artifact.navs = configNavs;
            }

            let componentDocItems: ComponentDocItem[] = [];
            this.docgeni.librariesBuilder.libraries.forEach((libraryBuilder) => {
                componentDocItems = componentDocItems.concat(libraryBuilder.generateDocsAndNavsForLocale(locale.key, artifact.navs));
            });

            artifact.docs = artifact.docs.concat(componentDocItems);
            this.navigationArtifact[locale.key] = artifact;
        }
    }

    private async buildLocalNavs(dirPath: string, docItems: DocItem[], excludeDirs?: string[]) {
        const navs = await this.buildLocalNavItems(dirPath, docItems, undefined, excludeDirs);
        const homeMeta = this.resolveHomeMeta(dirPath, undefined);
        return { navs, homeMeta };
    }

    private async buildLocalNavItems(
        dirPath: string,
        docItems: DocItem[],
        parentItem?: NavigationItem,
        excludeDirs?: string[],
    ): Promise<NavigationItem[]> {
        const dirsAndFiles = await this.docgeni.host.getDirsAndFiles(dirPath, { exclude: excludeDirs });
        const items: NavigationItem[] = [];

        for (const dirname of dirsAndFiles) {
            const absDocPath = toolkit.path.resolve(dirPath, dirname);
            if (await this.docgeni.host.isDirectory(absDocPath)) {
                const entryFile = this.tryGetEntryFile(absDocPath);
                const currentPath = this.getCurrentRoutePath(dirname, entryFile);
                const fullRoutePath = this.getFullRoutePath(currentPath, parentItem);
                // 当 parent item 的 path 为空时，说明有子频道，父频道就是一个分组
                const parentIsActualChannel = parentItem && parentItem.path;
                const navItem: NavigationItem = {
                    id: fullRoutePath,
                    path: fullRoutePath,
                    channelPath: parentIsActualChannel ? parentItem.channelPath : fullRoutePath,
                    title: getDocTitle(entryFile && entryFile.meta.title, dirname),
                    subtitle: entryFile && entryFile.meta.subtitle,
                    hidden: entryFile && entryFile.meta.hidden,
                    items: [],
                    order: entryFile && toolkit.utils.isNumber(entryFile.meta.order) ? entryFile.meta.order : Number.MAX_SAFE_INTEGER,
                };
                navItem.items = await this.buildLocalNavItems(absDocPath, docItems, navItem, excludeDirs);
                // hide it when hidden is true
                if (!navItem.hidden) {
                    items.push(navItem);
                }
                continue;
            }
            if (path.extname(absDocPath) !== '.md') {
                continue;
            }
            const docFile = this.docgeni.docsBuilder.getDoc(absDocPath);
            if (!docFile) {
                throw new Error(`Can't find doc file for ${absDocPath}`);
            }
            const isEntry = isEntryDoc(docFile.name);
            if (isEntry && !parentItem && this.docgeni.config.mode === 'full') {
                continue;
            }
            if (isEntry && toolkit.utils.isEmpty(docFile.output)) {
                continue;
            }

            const docItem = this.buildLocalDocItem(docFile, parentItem);
            // hide it when hidden is true
            if (!docItem.hidden) {
                items.push(docItem);
                docItems.push(docItem);
            }
        }

        return ascendingSortByOrder(items);
    }

    private buildLocalDocItem(docFile: DocSourceFile, parentItem?: NavigationItem): NavigationItem {
        const isEntry = isEntryDoc(docFile.name);
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
            headings: docFile.headings,
        };
        docItem.contentPath = docFile.getRelativeOutputPath();
        docItem.originPath = docFile.relative;
        return docItem;
    }

    private resolveHomeMeta(dirPath: string, parentItem?: NavigationItem): HomeDocMeta | undefined {
        if (parentItem || this.docgeni.config.mode !== 'full') {
            return undefined;
        }
        const entryFile = this.tryGetEntryFile(dirPath);
        if (!entryFile || !isEntryDoc(entryFile.name)) {
            return undefined;
        }
        const homeMeta = entryFile.meta;
        homeMeta.contentPath = entryFile.getRelativeOutputPath();
        return homeMeta;
    }

    private tryGetEntryFile(dirPath: string) {
        const fullPath = DOCS_ENTRY_FILE_NAMES.map((name) => {
            return toolkit.path.resolve(dirPath, `${name}.md`);
        }).find((path) => {
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
