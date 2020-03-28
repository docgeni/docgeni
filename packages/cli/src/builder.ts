import { BuilderFacade, BuilderPaths, DocSourceFile } from './builder.facade';
import { SyncHook } from 'tapable';
import { Plugin } from './plugins';
import { DocgConfig, Library } from './interfaces';
import * as fs from 'fs-extra';
import path from 'path';
import glob from 'glob';
import { DocgContext } from './context';

export interface BuilderOptions {
    cwd?: string;
    watch?: boolean;
    presets?: string[];
    plugins?: string[];
}

export class Builder implements BuilderFacade {
    watch: boolean;
    paths: BuilderPaths;
    config: DocgConfig;

    private presets: string[];
    private plugins: string[];
    private initialPlugins: Plugin[] = [];

    hooks = {
        docCompile: new SyncHook<DocSourceFile>(['docSourceFiles']),
        docsCompile: new SyncHook<DocSourceFile[]>(['docSourceFile'])
    };

    constructor(options: BuilderOptions) {
        this.paths = {
            cwd: options.cwd || process.cwd()
        };
        this.watch = options.watch || false;
        this.presets = options.presets || [];
        this.plugins = options.plugins || [require.resolve('./plugins/markdown')];
        this.initialize();
    }

    initialize() {
        this.loadPresets();
        this.loadPlugins();
        this.initialPlugins.forEach(plugin => {
            plugin.apply(this);
        });
    }

    async run(config: DocgConfig) {
        this.config = config;
        if (!fs.existsSync(config.docsPath)) {
            throw new Error(`docs folder(${config.docsPath}) has not exists`);
        }
        this.paths.absDocsPath = this.getAbsPath(config.docsPath);
        this.paths.absOutputPath = this.getAbsPath(config.output);
        this.paths.absSitePath = this.getAbsPath(config.sitePath);
        this.paths.absSiteContentPath = path.resolve(this.paths.absSitePath, './src/app/content');
        // clear docs content dest dir
        await fs.remove(this.paths.absSiteContentPath);
        await this.generateContentDocs();
        await this.generateContentLibs();
    }

    private async generateContentDocs() {
        const docPaths = glob.sync(this.paths.absDocsPath + '/**/*', { nosort: true });
        const docSourceFiles: DocSourceFile[] = [];
        const absSiteContentDocsPath = path.resolve(this.paths.absSiteContentPath, 'docs');
        for (const docPath of docPaths) {
            const stats = await fs.stat(docPath);
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
        const content = await fs.readFile(absDocPath, 'UTF-8');
        const docSourceFile: DocSourceFile = {
            absPath: absDocPath,
            content,
            dirname: path.dirname(absDocPath),
            ext: path.extname(absDocPath),
            basename: path.basename(absDocPath)
        };
        this.hooks.docCompile.call(docSourceFile);
        const docDestPath = path.resolve(absDestDirPath, docSourceFile.basename);
        await fs.ensureDir(absDestDirPath);
        await fs.outputFile(docDestPath, docSourceFile.content, { encoding: 'UTF-8' });
        return docSourceFile;
    }

    private async generateContentLibs() {
        for (const lib of this.config.libs) {
            await this.generateContentLib(lib);
        }
    }

    private async generateContentLib(lib: Library) {
        const absLibPath = this.getAbsPath(lib.rootPath);
        const dirs = await fs.readdir(absLibPath);
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
                await fs.copy(absComponentExamplesPath, absComponentExamplesDestPath);
            }
        }
    }

    private dirIsDirectory(dir: string) {
        return fs.statSync(dir).isDirectory();
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
