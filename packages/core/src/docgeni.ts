import { SyncHook, AsyncSeriesHook } from 'tapable';
import { Plugin } from './plugins';
import { DocgeniConfig, DocgeniSiteConfig, NavigationItem, ChannelItem } from './interfaces';
import * as path from 'path';
import { toolkit } from '@docgeni/toolkit';

import {
    DocgeniContext,
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
import { buildNavsMapForLocales, createDocSourceFile, getDocRoutePath, getDocTitle, isEntryDoc } from './utils';
import * as chokidar from 'chokidar';
import { DocsCompiler } from './docs-compiler';
import { Detector } from './detector';
import { SiteBuilder } from './site-builder';
import { DocgeniPaths } from './docgeni-paths';
import { ValidationError } from './errors';
import * as semver from 'semver';
export class Docgeni implements DocgeniContext {
    watch: boolean;
    paths: DocgeniPaths;
    config: DocgeniConfig;
    siteConfig: Partial<DocgeniSiteConfig> = {};
    enableIvy: boolean;
    private options: DocgeniOptions;
    private presets: string[];
    private plugins: string[];
    private initialPlugins: Plugin[] = [];
    private localesNavsMap: Record<string, NavigationItem[]> = {};
    /* The navs that generate by docs dir insertion location  */
    private docsNavInsertIndex: number;
    private docsCompiler: DocsCompiler = new DocsCompiler(this);
    private examplesEmitter: ExamplesEmitter;
    private libraryCompilers: LibraryCompiler[] = [];
    private siteBuilder: SiteBuilder;

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
        this.options = options;
        this.config = { ...DEFAULT_CONFIG, ...options.config };
        this.siteConfig = {
            title: this.config.title,
            heading: this.config.heading,
            description: this.config.description,
            mode: this.config.mode,
            theme: this.config.theme,
            baseHref: this.config.baseHref,
            heads: this.config.heads,
            locales: this.config.locales,
            defaultLocale: this.config.defaultLocale,
            logoUrl: this.config.logoUrl,
            repoUrl: this.config.repoUrl
        };
        this.paths = new DocgeniPaths(options.cwd || process.cwd(), this.config.docsPath, this.config.output);
        this.watch = options.watch || false;
        this.presets = options.presets || [];
        this.plugins = options.plugins || [
            require.resolve('./plugins/markdown'),
            require.resolve('./plugins/config'),
            require.resolve('./plugins/angular')
        ];
        if (!this.config.libs) {
            this.config.libs = [];
        }

        this.initialize();
    }

    async run() {
        try {
            await this.verifyConfig();
            const detector = new Detector(this);
            await detector.detect();
            if (this.config.siteProjectName && !detector.siteProject) {
                throw new ValidationError(`site project name(${this.config.siteProjectName}) is not exists`);
            }
            this.enableIvy = detector.ngVersion ? semver.gte(detector.ngVersion, '9.0.0') : true;
            this.siteBuilder = new SiteBuilder(this);
            await this.siteBuilder.initialize(detector.siteProject);
            this.hooks.run.call();
            this.setDocsNavInsertIndex();
            this.examplesEmitter = new ExamplesEmitter(this);
            this.libraryCompilers = this.config.libs.map(lib => {
                return new LibraryCompiler(this, lib, this.examplesEmitter);
            });
            // clear docs content dist dir
            await toolkit.fs.remove(this.paths.absSiteContentPath);
            // clear assets content dist dir
            await toolkit.fs.remove(this.paths.absSiteAssetsContentPath);
            // ensure docs content dist dir and assets content dist dir
            toolkit.fs.ensureDir(this.paths.absSiteContentPath);
            toolkit.fs.ensureDir(this.paths.absSiteAssetsContentPath);

            // build navs by config
            this.localesNavsMap = buildNavsMapForLocales(this.config.locales, this.config.navs);

            // docs compile
            if (this.config.docsPath) {
                await this.docsCompiler.compile();
                if (this.watch) {
                    const watcher = chokidar.watch([this.config.docsPath], { cwd: this.paths.cwd, ignoreInitial: true, interval: 1000 });
                    this.logger.info(`Start watching docs folder [${this.config.docsPath}] ...`);
                    ['add', 'change'].forEach(eventName => {
                        watcher.on(eventName, async (filePath: string) => {
                            this.logger.info(`${filePath} ${eventName}`);
                            await this.docsCompiler.compile();
                            await this.generateSiteNavs();
                        });
                    });
                }
            }

            // compile all libs
            for (const libraryCompiler of this.libraryCompilers) {
                await libraryCompiler.compile();
                if (this.watch) {
                    const watcher = chokidar.watch([libraryCompiler.getAbsLibPath()], { ignoreInitial: true, interval: 1000 });
                    this.logger.info(`Start watching lib [${libraryCompiler.lib.name}] ...`);
                    ['add', 'change'].forEach(eventName => {
                        watcher.on(eventName, async (filePath: string) => {
                            this.logger.info(`${eventName}  ${filePath}`);
                            await libraryCompiler.compile();
                            this.examplesEmitter.emit();
                            await this.generateSiteNavs();
                        });
                    });
                }
            }
            await this.examplesEmitter.emit();
            await this.generateSiteConfig();
            await this.generateSiteNavs();
            if (!this.options.cmdArgs.skipSite) {
                if (this.watch) {
                    await this.siteBuilder.start();
                } else {
                    await this.siteBuilder.build(this.options.cmdArgs);
                }
            }
        } catch (error) {
            if (error instanceof ValidationError) {
                this.logger.error(error.message);
            } else {
                this.logger.error(error);
            }
            process.exit(0);
        }
    }

    private initialize() {
        this.loadPresets();
        this.loadPlugins();
        this.initialPlugins.forEach(plugin => {
            plugin.apply(this);
        });
        toolkit.initialize({
            baseDir: __dirname
        });
    }

    private async verifyConfig() {
        if (this.config.docsPath && !toolkit.fs.existsSync(this.config.docsPath)) {
            throw new ValidationError(`docs folder(${this.config.docsPath}) has not exists`);
        }
    }

    private async setDocsNavInsertIndex() {
        let docsNavInsertIndex = this.config.navs.indexOf(null);
        if (docsNavInsertIndex >= 0) {
            this.config.navs = this.config.navs.filter(item => {
                return !!item;
            });
        } else {
            docsNavInsertIndex = this.config.navs.length;
        }
        this.docsNavInsertIndex = docsNavInsertIndex;
    }

    private async generateSiteConfig() {
        const outputConfigPath = path.resolve(this.paths.absSiteContentPath, 'config.ts');
        toolkit.template.generate('config.hbs', outputConfigPath, {
            siteConfig: JSON.stringify(this.siteConfig, null, 4)
        });
    }

    private async generateSiteNavs() {
        const localesNavsMap: Record<string, NavigationItem[]> = JSON.parse(JSON.stringify(this.localesNavsMap));
        this.config.locales.forEach(locale => {
            localesNavsMap[locale.key].splice(this.docsNavInsertIndex, 0, ...this.docsCompiler.getLocaleNavs(locale.key));
            this.libraryCompilers.forEach(libraryCompiler => {
                const libNav: ChannelItem = localesNavsMap[locale.key].find(nav => {
                    return nav.lib === libraryCompiler.lib.name;
                });
                libNav.items = libraryCompiler.getLocaleCategories(locale.key);
            });
        });
        await toolkit.fs.writeFile(`${this.paths.absSiteContentPath}/navigations.json`, JSON.stringify(localesNavsMap, null, 2));
        await toolkit.fs.writeFile(`${this.paths.absSiteAssetsContentPath}/navigations.json`, JSON.stringify(localesNavsMap, null, 2));
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
