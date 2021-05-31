import { createDocgeniHost, DocgeniHost } from './docgeni-host';
import { virtualFs, normalize } from '@angular-devkit/core';
import { NodeJsAsyncHost } from '@angular-devkit/core/node';
import { SyncHook, AsyncSeriesHook } from 'tapable';
import { Plugin } from './plugins';
import { DocgeniConfig, DocgeniSiteConfig } from './interfaces';
import path from 'path';
import { toolkit } from '@docgeni/toolkit';

import { DocgeniContext, DocgeniHooks, DocgeniOptions } from './docgeni.interface';
import { DEFAULT_CONFIG } from './defaults';
import { Detector } from './detector';
import { DocgeniPaths } from './docgeni-paths';
import { ValidationError } from './errors';
import { DocsBuilder, DocSourceFile, LibrariesBuilder, NavsBuilder, SiteBuilder } from './builders';
import { AngularCommander } from './ng-commander';
import { DocgeniScopedHost } from './fs';

export class Docgeni implements DocgeniContext {
    watch: boolean;
    paths: DocgeniPaths;
    config: DocgeniConfig;
    siteConfig: Partial<DocgeniSiteConfig> = {};
    enableIvy: boolean;
    public docsBuilder: DocsBuilder;
    public librariesBuilders: LibrariesBuilder;
    public navsBuilder: NavsBuilder;
    public fs: virtualFs.Host;
    public host: DocgeniHost;
    private options: DocgeniOptions;
    private presets: string[];
    private plugins: string[];
    private initialPlugins: Plugin[] = [];
    private ngCommander: AngularCommander;

    hooks: DocgeniHooks = {
        run: new SyncHook([]),
        docBuild: new SyncHook<DocSourceFile>(['docSourceFile']),
        docBuildSucceed: new SyncHook<DocSourceFile>(['docSourceFile']),
        emit: new AsyncSeriesHook<void>([])
    };

    get logger() {
        return toolkit.print;
    }

    constructor(options: DocgeniOptions) {
        this.options = options;
        this.config = this.normalizeConfig(options.config);
        this.siteConfig = {
            title: this.config.title,
            description: this.config.description,
            mode: this.config.mode,
            theme: this.config.theme,
            baseHref: this.config.baseHref,
            locales: this.config.locales,
            defaultLocale: this.config.defaultLocale,
            logoUrl: this.config.logoUrl,
            repoUrl: this.config.repoUrl
        };
        this.paths = new DocgeniPaths(options.cwd || process.cwd(), this.config.docsDir, this.config.outputDir);
        this.watch = options.watch || false;
        this.presets = options.presets || [];
        this.fs = new DocgeniScopedHost(new NodeJsAsyncHost(), this.paths.cwd);
        this.host = options.host || createDocgeniHost(this.fs);
        this.plugins = options.plugins || [
            require.resolve('./plugins/markdown'),
            require.resolve('./plugins/config'),
            require.resolve('./plugins/angular')
        ];

        this.initialize();
    }

    async run() {
        try {
            await this.verifyConfig();
            const detector = new Detector(this);
            await detector.detect();
            this.enableIvy = detector.enableIvy;
            const siteBuilder = new SiteBuilder(this);
            const siteProject = await siteBuilder.build(detector.siteProject);
            this.ngCommander = new AngularCommander(this, siteProject);

            this.hooks.run.call();

            this.librariesBuilders = new LibrariesBuilder(this);
            await this.librariesBuilders.initialize();
            this.docsBuilder = new DocsBuilder(this);
            this.navsBuilder = new NavsBuilder(this);

            // clear docs content dist dir
            await toolkit.fs.remove(this.paths.absSiteContentPath);
            // clear assets content dist dir
            await toolkit.fs.remove(this.paths.absSiteAssetsContentPath);

            // ensure docs content dist dir and assets content dist dir
            toolkit.fs.ensureDir(this.paths.absSiteContentPath);
            toolkit.fs.ensureDir(this.paths.absSiteAssetsContentPath);

            this.docsBuilder.hooks.buildDocsSucceed.tap('EmitDocs', async docsBuilder => {
                await docsBuilder.emit();
                this.logger.succuss(`Docs: emit successfully, total: ${docsBuilder.getDocs().length}`);
            });
            this.logger.info('Start building docs');
            await this.docsBuilder.build();

            this.librariesBuilders.hooks.buildLibrariesSucceed.tap('EmitLibs', async librariesBuilders => {
                await librariesBuilders.emit();
            });
            await this.librariesBuilders.build();
            await this.navsBuilder.run();

            this.docsBuilder.watch();
            this.librariesBuilders.watch();

            await this.generateSiteConfig();

            if (!this.options.cmdArgs.skipSite) {
                if (this.watch) {
                    await this.ngCommander.serve(this.options.cmdArgs);
                } else {
                    await this.ngCommander.build(this.options.cmdArgs);
                }
            }
        } catch (error) {
            if (error instanceof ValidationError) {
                this.logger.error(`Validate Error: ${error.message}`);
            } else {
                throw error;
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

    public async verifyConfig() {
        if (!['full', 'lite'].includes(this.config.mode)) {
            throw new ValidationError(`mode must be full or lite, current is ${this.config.mode}`);
        }

        if (this.config.docsDir) {
            const absDocsPath = path.resolve(this.paths.cwd, this.config.docsDir);
            const docsDosExists = await this.host.pathExists(absDocsPath);
            if (!docsDosExists) {
                throw new ValidationError(`docs dir(${this.config.docsDir}) has not exists, full path: ${absDocsPath}`);
            }
        }

        const defaultLocaleObj = this.config.locales.find(item => {
            return item.key === this.config.defaultLocale;
        });
        if (!defaultLocaleObj) {
            throw new ValidationError(`default locale(${this.config.defaultLocale}) is not in locales`);
        }
    }

    private normalizeConfig(inputConfig: DocgeniConfig) {
        const config = { ...DEFAULT_CONFIG, ...inputConfig };
        config.defaultLocale = config.defaultLocale || DEFAULT_CONFIG.defaultLocale;
        config.mode = config.mode || DEFAULT_CONFIG.mode;
        config.theme = config.theme || DEFAULT_CONFIG.theme;

        // set locales from defaultLocale
        if (!config.locales || toolkit.utils.isEmpty(config.locales)) {
            config.locales = [
                {
                    name: config.defaultLocale,
                    key: config.defaultLocale
                }
            ];
        }
        if (!config.libs) {
            config.libs = [];
        }

        if (!config.navs) {
            config.navs = [];
        }
        return config;
    }

    private async generateSiteConfig() {
        const outputConfigPath = path.resolve(this.paths.absSiteContentPath, 'config.ts');
        toolkit.template.generate('config.hbs', outputConfigPath, {
            siteConfig: JSON.stringify(this.siteConfig, null, 4)
        });
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
