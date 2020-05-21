import { SyncHook, AsyncSeriesHook } from 'tapable';
import { Plugin } from './plugins';
import {
    DocgeniConfig,
    Library,
    DocgeniSiteConfig,
    NavigationItem,
    CategoryItem,
    ChannelItem,
    DocItem,
    ComponentDocItem
} from './interfaces';
import * as path from 'path';
import * as glob from 'glob';
import { toolkit } from '@docgeni/toolkit';
import {
    DocgeniContext,
    DocgeniPaths,
    DocgeniHooks,
    DocSourceFile,
    DocgeniOptions,
    LibraryContext,
    LibraryComponentContext,
    CategoryDocMeta
} from './docgeni.interface';
import { DocType } from './enums';
import { DEFAULT_CONFIG } from './defaults';
import { LibraryCompiler, ExamplesEmitter } from './library-compiler';
import { buildLocalesNavsMap, createDocSourceFile, getDocRoutePath, getDocTitle, isEntryDoc } from './utils';

export class Docgeni implements DocgeniContext {
    watch: boolean;
    paths: DocgeniPaths;
    config: DocgeniConfig;
    siteConfig: Partial<DocgeniSiteConfig> = {};
    private presets: string[];
    private plugins: string[];
    private initialPlugins: Plugin[] = [];
    private localesNavsMap: Record<string, NavigationItem[]> = {};

    hooks: DocgeniHooks = {
        run: new SyncHook([]),
        docCompile: new SyncHook<DocSourceFile>(['docSourceFile']),
        docsCompile: new SyncHook<DocSourceFile[]>(['docSourceFiles']),
        libCompile: new SyncHook<LibraryContext>(['lib']),
        libComponentCompile: new SyncHook<LibraryContext, LibraryComponentContext>(['lib', 'component']),
        emit: new AsyncSeriesHook<void>([])
    };

    get logger() {
        return toolkit.print;
    }

    constructor(options: DocgeniOptions) {
        this.paths = {
            cwd: options.cwd || process.cwd()
        };
        this.watch = options.watch || false;
        this.presets = options.presets || [];
        this.plugins = options.plugins || [
            require.resolve('./plugins/markdown'),
            require.resolve('./plugins/config'),
            require.resolve('./plugins/angular')
        ];
        this.initialize();
    }

    initialize() {
        this.loadPresets();
        this.loadPlugins();
        this.initialPlugins.forEach(plugin => {
            plugin.apply(this);
        });
        toolkit.initialize({
            baseDir: __dirname
        });
    }

    async run(config: DocgeniConfig) {
        try {
            this.config = { ...DEFAULT_CONFIG, ...config };
            this.siteConfig = {
                title: this.config.title,
                heading: this.config.heading,
                description: this.config.description,
                mode: this.config.mode,
                baseHref: this.config.baseHref,
                heads: this.config.heads,
                locales: this.config.locales,
                defaultLocale: this.config.defaultLocale,
                repoUrl: this.config.repoUrl,
                navs: this.config.navs
            };
            this.hooks.run.call();
            if (!toolkit.fs.existsSync(config.docsPath)) {
                throw new Error(`docs folder(${config.docsPath}) has not exists`);
            }
            this.paths.absDocsPath = this.getAbsPath(config.docsPath);
            this.paths.absOutputPath = this.getAbsPath(config.output);
            this.paths.absSitePath = this.getAbsPath(config.sitePath);
            this.paths.absSiteContentPath = path.resolve(this.paths.absSitePath, './src/app/content');
            this.paths.absSiteAssetsContentPath = path.resolve(this.paths.absSitePath, './src/assets/content');
            this.paths.absSiteAssetsContentDocsPath = path.resolve(this.paths.absSiteAssetsContentPath, './docs');

            // clear docs content dist dir
            await toolkit.fs.remove(this.paths.absSiteContentPath);
            // clear assets content dist dir
            await toolkit.fs.remove(this.paths.absSiteAssetsContentPath);

            // build navs by config
            let docsNavInsertIndex = this.config.navs.indexOf(null);
            if (docsNavInsertIndex >= 0) {
                this.config.navs = this.config.navs.filter(item => {
                    return !!item;
                });
            } else {
                docsNavInsertIndex = this.config.navs.length;
            }
            this.localesNavsMap = buildLocalesNavsMap(this.config.locales, this.config.navs);

            await this.generateContentDocs(docsNavInsertIndex);
            await this.generateContentLibs();
            await this.generateSiteConfig();
            await this.generateSiteNavs();
        } catch (error) {
            this.logger.error(error);
        }
    }

    private async generateContentDocs(docsNavInsertIndex: number) {
        const localeKeys = this.config.locales.map(locale => {
            return locale.key;
        });

        for (const locale of this.config.locales) {
            const isDefaultLocale = locale.key === this.config.defaultLocale;
            const localeDocsPath = isDefaultLocale ? this.paths.absDocsPath : path.resolve(this.paths.absDocsPath, locale.key);
            if (await toolkit.fs.pathExists(localeDocsPath)) {
                const result = await this.generateDirContentDocs(localeDocsPath, locale.key, true, isDefaultLocale ? localeKeys : []);
                this.localesNavsMap[locale.key].splice(docsNavInsertIndex, 0, ...result.navs);
            }
        }
    }

    private async generateDirContentDocs(dirPath: string, locale: string, isRoot?: boolean, excludeDirs?: string[]) {
        const dirsAndFiles = await toolkit.fs.getDirsAndFiles(dirPath, {
            excludeDirs
        });
        const navOrdersMap: WeakMap<NavigationItem, number> = new WeakMap();
        let navs: Array<NavigationItem> = [];
        let categoryMeta: CategoryDocMeta = null;
        for (const docPath of dirsAndFiles) {
            const fullPath = path.resolve(dirPath, docPath);
            if (toolkit.fs.isDirectory(fullPath)) {
                const category: NavigationItem = {
                    id: docPath,
                    path: docPath.toLowerCase(),
                    title: toolkit.strings.pascalCase(docPath),
                    subtitle: '',
                    items: []
                };

                navs.push(category);
                const result = await this.generateDirContentDocs(fullPath, locale, false);
                category.items = result.navs;
                let order = Number.MAX_SAFE_INTEGER;
                if (result.categoryMeta) {
                    category.title = result.categoryMeta.title;
                    // category.path = result.categoryMeta.path;
                    if (toolkit.utils.isNumber(result.categoryMeta.order)) {
                        order = result.categoryMeta.order;
                    }
                }
                navOrdersMap.set(category, order);
            } else {
                const docDestAssetsContentPath = dirPath.replace(this.paths.absDocsPath, this.paths.absSiteAssetsContentDocsPath);
                const { docSourceFile, docDestPath, filename } = await this.generateContentDoc(fullPath, docDestAssetsContentPath);

                if (isRoot && isEntryDoc(docSourceFile.basename)) {
                    // do nothings
                } else {
                    const docItem: ComponentDocItem = {
                        id: docSourceFile.basename,
                        path: getDocRoutePath(docSourceFile.result.meta.path, docSourceFile.basename),
                        title: getDocTitle(docSourceFile.result.meta.title, docSourceFile.basename),
                        subtitle: ''
                    };

                    if (isEntryDoc(docSourceFile.basename)) {
                        categoryMeta = docSourceFile.result.meta.category;
                    }
                    if (toolkit.utils.isNumber(docSourceFile.result.meta.order)) {
                        navOrdersMap.set(docItem, docSourceFile.result.meta.order);
                    } else {
                        navOrdersMap.set(docItem, Number.MAX_SAFE_INTEGER);
                    }

                    const contentPath = docDestPath.replace(this.paths.absSiteAssetsContentPath, '');
                    docItem.contentPath = contentPath;
                    navs.push(docItem);
                }
            }
        }
        navs = toolkit.utils.sortByOrderMap(navs, navOrdersMap);
        return { navs, categoryMeta };
    }

    private async generateContentDoc(absDocPath: string, absDestDirPath: string, docType: DocType = DocType.general) {
        const content = await toolkit.fs.readFile(absDocPath, 'UTF-8');
        const docSourceFile = createDocSourceFile(absDocPath, content, docType);
        this.hooks.docCompile.call(docSourceFile);
        const filename = docSourceFile.basename + docSourceFile.ext;
        const docDestPath = path.resolve(absDestDirPath, filename);
        await toolkit.fs.ensureDir(absDestDirPath);
        await toolkit.fs.outputFile(docDestPath, docSourceFile.result.html, { encoding: 'UTF-8' });
        return { docSourceFile, docDestPath, filename };
    }

    private async generateContentLibs() {
        const examplesEmitter = new ExamplesEmitter(this);
        for (const lib of this.config.libs) {
            const libraryCompiler = new LibraryCompiler(this, lib, examplesEmitter);
            const localesCategoriesMap = await libraryCompiler.compile();
            this.config.locales.forEach(locale => {
                const libNav: ChannelItem = this.localesNavsMap[locale.key].find(nav => {
                    return nav.lib === lib.name;
                });
                libNav.items = localesCategoriesMap[locale.key].categories;
            });
        }
        examplesEmitter.emit();
    }

    private async generateSiteConfig() {
        const outputConfigPath = path.resolve(this.paths.absSiteContentPath, 'config.ts');
        toolkit.template.generate('config.hbs', outputConfigPath, {
            siteConfig: JSON.stringify(this.siteConfig, null, 4)
        });
    }

    private async generateSiteNavs() {
        await toolkit.fs.writeFile(`${this.paths.absSiteAssetsContentPath}/navigations.json`, JSON.stringify(this.localesNavsMap, null, 2));
    }

    public getAbsPath(absOrRelativePath: string) {
        return path.resolve(this.paths.cwd, absOrRelativePath);
    }

    private loadPresets() {
        this.presets.forEach(preset => {
            const result = require(preset);
            result(this);
        });
    }

    private loadPlugins() {
        this.plugins.map(name => {
            const pluginCtor = require(name);
            if (pluginCtor) {
                this.initialPlugins.push(new pluginCtor());
            } else {
                throw new Error(`plugin ${name} is not found`);
            }
        });
    }
}
