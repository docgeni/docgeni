import { BuilderFacade, BuilderPaths, DocSourceFile, BuilderHooks } from './builder.facade';
import { SyncHook, AsyncSeriesHook } from 'tapable';
import { Plugin } from './plugins';
import { DocgeniConfig, Library, DEFAULT_CONFIG, DocgeniSiteConfig } from './interfaces';
import * as path from 'path';
import * as glob from 'glob';
import { DocgeniContext } from './context';
import { toolkit } from '@docgeni/toolkit';
export interface BuilderOptions {
    cwd?: string;
    watch?: boolean;
    presets?: string[];
    plugins?: string[];
}

export class Builder implements BuilderFacade {
    watch: boolean;
    paths: BuilderPaths;
    config: DocgeniConfig;
    siteConfig: Partial<DocgeniSiteConfig> = {};
    private presets: string[];
    private plugins: string[];
    private initialPlugins: Plugin[] = [];

    hooks: BuilderHooks = {
        run: new SyncHook([]),
        docCompile: new SyncHook<DocSourceFile>(['docSourceFiles']),
        docsCompile: new SyncHook<DocSourceFile[]>(['docSourceFile']),
        emit: new AsyncSeriesHook<void>([])
    };

    constructor(options: BuilderOptions) {
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
        this.config = Object.assign(DEFAULT_CONFIG, config);
        this.siteConfig.title = this.config.title;
        this.siteConfig.description = this.config.description;
        this.siteConfig.locales = this.config.locales;
        this.siteConfig.navs = this.config.navs;

        this.hooks.run.call();
        if (!toolkit.fs.existsSync(config.docsPath)) {
            throw new Error(`docs folder(${config.docsPath}) has not exists`);
        }
        this.paths.absDocsPath = this.getAbsPath(config.docsPath);
        this.paths.absOutputPath = this.getAbsPath(config.output);
        this.paths.absSitePath = this.getAbsPath(config.sitePath);
        this.paths.absSiteContentPath = path.resolve(this.paths.absSitePath, './src/app/content');
        // clear docs content dest dir
        await toolkit.fs.remove(this.paths.absSiteContentPath);
        await this.generateContentDocs();
        await this.generateContentLibs();
        await this.generateSiteConfig();
    }

    private async generateContentDocs() {
        const docPaths = glob.sync(this.paths.absDocsPath + '/**/*', { nosort: true });
        const docSourceFiles: DocSourceFile[] = [];
        const absSiteContentDocsPath = path.resolve(this.paths.absSiteContentPath, 'docs');
        for (const docPath of docPaths) {
            const stats = await toolkit.fs.stat(docPath);
            if (stats.isDirectory()) {
                console.log(`This is dir ${docPath}`);
            } else {
                const docDestDirname = path.dirname(docPath).replace(this.paths.absDocsPath, absSiteContentDocsPath);
                const docSourceFile = await this.generateContentDoc(docPath, docDestDirname);

                docSourceFiles.push(docSourceFile);
            }
        }
        if (this.watch) {
            // watch
        }
        // this.hooks.docsCompile.call(docSourceFiles);
    }

    private async generateContentDoc(absDocPath: string, absDestDirPath: string) {
        const content = await toolkit.fs.readFile(absDocPath, 'UTF-8');
        const docSourceFile: DocSourceFile = {
            absPath: absDocPath,
            content,
            dirname: path.dirname(absDocPath),
            ext: path.extname(absDocPath),
            basename: path.basename(absDocPath)
        };
        this.hooks.docCompile.call(docSourceFile);
        const docDestPath = path.resolve(absDestDirPath, docSourceFile.basename);
        await toolkit.fs.ensureDir(absDestDirPath);
        await toolkit.fs.outputFile(docDestPath, docSourceFile.content, { encoding: 'UTF-8' });
        return docSourceFile;
    }

    private async generateContentLibs() {
        for (const lib of this.config.libs) {
            await this.generateContentLib(lib);
        }
    }

    private async generateContentLib(lib: Library) {
        const absLibPath = this.getAbsPath(lib.rootPath);
        const dirs = await toolkit.fs.readdir(absLibPath);
        const absSiteContentComponentsPath = path.resolve(this.paths.absSiteContentPath, 'components');
        for (const dir of dirs) {
            const absComponentPath = path.resolve(absLibPath, dir);
            if (this.dirIsDirectory(absComponentPath)) {
                const absComponentDocPath = path.resolve(absComponentPath, 'doc');
                const absComponentExamplesPath = path.resolve(absComponentPath, 'examples');
                const absComponentDocZHPath = path.resolve(absComponentDocPath, 'zh-cn.md');
                const absComponentExamplesDestPath = path.resolve(absSiteContentComponentsPath, dir);
                // const absComponentDocENPath = path.resolve(absComponentDocPath, 'en-us.md');
                await this.generateContentDoc(absComponentDocZHPath, path.resolve(absSiteContentComponentsPath, `${dir}/doc`));
                // await this.generateContentDoc(absComponentDocENPath, path.resolve(absSiteContentComponentsPath, `${dir}/doc`));
                await toolkit.fs.copy(absComponentExamplesPath, absComponentExamplesDestPath);
            }
        }
    }

    private async generateSiteConfig() {
        const outputConfigPath = path.resolve(this.paths.absSiteContentPath, 'config.ts');
        toolkit.template.generate('config.hbs', outputConfigPath, {
            siteConfig: JSON.stringify(this.siteConfig, null, 4)
        });
    }

    private dirIsDirectory(dir: string) {
        return toolkit.fs.statSync(dir).isDirectory();
    }

    private getAbsPath(absOrRelativePath: string) {
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
