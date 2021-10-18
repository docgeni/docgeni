import { createDocgeniHost, DocgeniHost } from './docgeni-host';
import { virtualFs, getSystemPath } from '@angular-devkit/core';
import { SyncHook, AsyncSeriesHook } from 'tapable';
import { Plugin } from './plugins';
import { DocgeniConfig, NavigationItem } from './interfaces';
import path from 'path';
import { toolkit } from '@docgeni/toolkit';

import { DocgeniContext, DocgeniHooks, DocgeniOptions } from './docgeni.interface';
import { DEFAULT_CONFIG } from './defaults';
import { DocgeniPaths } from './docgeni-paths';
import { ValidationError } from './errors';
import { DocsBuilder, DocSourceFile, LibrariesBuilder, NavsBuilder } from './builders';
import { DocgeniNodeJsAsyncHost, DocgeniScopedHost, resolve } from './fs';
import { ComponentsBuilder } from './builders/components-builder';
import { DocgeniProgress } from './progress';
import { DocgeniCompilationImpl } from './compilation';
import { CompilationIncrement, DocgeniCompilation, LibraryBuilder, LibraryComponent } from './types';

export class Docgeni implements DocgeniContext {
    watch: boolean;
    paths: DocgeniPaths;
    config: DocgeniConfig;
    enableIvy: boolean;
    public docsBuilder: DocsBuilder = new DocsBuilder(this);
    public librariesBuilder: LibrariesBuilder = new LibrariesBuilder(this);
    public navsBuilder: NavsBuilder = new NavsBuilder(this);
    public fs: virtualFs.Host;
    public host: DocgeniHost;
    public version: string;
    private options: DocgeniOptions;
    private presets: string[];
    private plugins: string[];
    private initialPlugins: Plugin[] = [];
    private progress = new DocgeniProgress(this);

    static createHooks(): DocgeniHooks {
        return {
            beforeRun: new AsyncSeriesHook([]),
            run: new AsyncSeriesHook([]),
            done: new AsyncSeriesHook([]),
            docBuild: new SyncHook<DocSourceFile>(['docSourceFile']),
            docBuildSucceed: new SyncHook<DocSourceFile>(['docSourceFile']),
            docsBuild: new SyncHook<DocsBuilder, DocSourceFile[]>(['docsBuilder', 'docs']),
            docsBuildSucceed: new SyncHook<DocsBuilder, DocSourceFile[]>(['docsBuilder', 'docs']),
            componentBuild: new SyncHook<LibraryComponent>(['component']),
            componentBuildSucceed: new SyncHook<LibraryComponent>(['component']),
            libraryBuild: new SyncHook<LibraryBuilder, LibraryComponent[]>(['libraryBuilder', 'components']),
            libraryBuildSucceed: new SyncHook<LibraryBuilder, LibraryComponent[]>(['libraryBuilder', 'components']),
            compilation: new SyncHook<DocgeniCompilation>(['compilation', 'compilationIncrement']),
            emit: new AsyncSeriesHook<void>([]),
            navsEmitSucceed: new SyncHook<NavsBuilder, Record<string, NavigationItem[]>>(['navsBuilder', 'config'])
        };
    }

    hooks: DocgeniHooks = Docgeni.createHooks();

    get logger() {
        return toolkit.print;
    }

    constructor(options: DocgeniOptions) {
        this.options = options;
        this.config = this.normalizeConfig(options.config);
        this.paths = new DocgeniPaths(options.cwd || process.cwd(), this.config.docsDir, this.config.outputDir);
        this.watch = options.watch || false;
        this.presets = options.presets || [];
        this.fs = new DocgeniScopedHost(new DocgeniNodeJsAsyncHost(), this.paths.cwd);
        this.host = options.host || createDocgeniHost(this.fs);
        this.plugins = options.plugins || [
            require.resolve('./plugins/markdown'),
            require.resolve('./plugins/config'),
            require.resolve('./angular/site-plugin'),
            require.resolve('./plugins/sitemap')
        ];
        this.version = options.version;

        this.initialize();
    }

    async compile(increment?: CompilationIncrement) {
        const compilation = this.createCompilation(increment);
        await compilation.run();
    }

    private createCompilation(increment?: CompilationIncrement) {
        const compilation = new DocgeniCompilationImpl(this, increment);
        this.hooks.compilation.call(compilation);
        return compilation;
    }

    async run() {
        try {
            await this.hooks.beforeRun.promise();
            await this.verifyConfig();
            await this.hooks.run.promise();
            await this.clearAndEnsureDirs();
            const compilation = this.createCompilation();
            await compilation.run();

            // custom components
            this.progress.text = 'Build custom components...';
            const componentsBuilder = new ComponentsBuilder(this);
            await componentsBuilder.build();
            await componentsBuilder.emit();
            componentsBuilder.watch();

            await this.hooks.done.promise();
        } catch (error) {
            if (error instanceof ValidationError) {
                this.logger.error(`Validate Error: ${error.message}`);
            } else {
                throw error;
            }
            process.exit(0);
        }
    }

    private async clearAndEnsureDirs() {
        // clear docs content dist dir
        await toolkit.fs.remove(this.paths.absSiteContentPath);
        // clear assets content dist dir
        await toolkit.fs.remove(this.paths.absSiteAssetsContentPath);
        // ensure docs content dist dir and assets content dist dir
        toolkit.fs.ensureDir(this.paths.absSiteContentPath);
        toolkit.fs.ensureDir(this.paths.absSiteAssetsContentPath);
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
        this.progress.initialize();
    }

    public async verifyConfig() {
        if (!['full', 'lite'].includes(this.config.mode)) {
            throw new ValidationError(`mode must be full or lite, current is ${this.config.mode}`);
        }

        if (this.config.docsDir) {
            const absDocsPath = resolve(this.paths.cwd, this.config.docsDir);
            const docsDosExists = await this.host.pathExists(absDocsPath);
            if (!docsDosExists) {
                throw new ValidationError(`docs dir(${this.config.docsDir}) has not exists, full path: ${getSystemPath(absDocsPath)}`);
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
        config.toc = config.toc || DEFAULT_CONFIG.toc;
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
            try {
                const pluginCtor = require(name);
                if (pluginCtor) {
                    this.initialPlugins.push(pluginCtor.default ? new pluginCtor.default() : new pluginCtor());
                } else {
                    throw new Error(`plugin ${name} is not found`);
                }
            } catch (error) {
                throw new Error(`plugin ${name} is not found`);
            }
        });
    }
}
