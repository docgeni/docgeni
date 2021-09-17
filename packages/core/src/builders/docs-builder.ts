import { SyncHook, AsyncSeriesHook } from 'tapable';
import { DocgeniContext } from '../docgeni.interface';
import { DocSourceFile } from './doc-file';
import path from 'path';
import { toolkit } from '@docgeni/toolkit';
import { Locale } from '../interfaces';
import chokidar from 'chokidar';
import { FileEmitter } from './emitter';

export class DocsBuilder extends FileEmitter {
    private docFiles = new Map<string, DocSourceFile>();

    private watchers: chokidar.FSWatcher[] = [];

    private get config() {
        return this.docgeni.config;
    }

    get size() {
        return this.docFiles.size;
    }

    constructor(private docgeni: DocgeniContext) {
        super();
    }

    public async run() {
        await this.initialize();
        await this.build();
        await this.emit();
    }

    public async initialize() {
        for (const locale of this.config.locales) {
            await this.initializeDocFiles(locale);
        }
    }

    public async build(docs: DocSourceFile[] = Array.from(this.docFiles.values())) {
        this.docgeni.hooks.docsBuild.call(this, docs);
        for (const doc of docs) {
            await this.buildDoc(doc);
        }
        this.docgeni.hooks.docsBuildSucceed.call(this, docs);
    }

    public async onEmit() {
        for (const file of this.docFiles.values()) {
            const { outputPath, content } = await file.emit(this.docgeni.paths.absSiteAssetsContentPath);
            this.addEmitFile(outputPath, content);
        }
    }

    public async clear() {
        this.watchers.forEach(watcher => {
            watcher.close();
        });
        this.watchers = [];
        delete this.docFiles;
        this.docFiles = new Map<string, DocSourceFile>();
    }

    public getDocs(): DocSourceFile[] {
        return Array.from(this.docFiles.values());
    }

    public getDoc(absPath: string) {
        return this.docFiles.get(absPath);
    }

    public watch() {
        if (this.docgeni.watch) {
            for (const locale of this.config.locales) {
                const localeDocsPath = this.getLocaleDocsPath(locale);
                const ignoreGlobs = this.getIgnoreGlobs(locale.key);
                this.watchDocs(locale, localeDocsPath, ignoreGlobs);
            }
        }
    }

    private getLocaleDocsPath(locale: Locale) {
        const isDefaultLocale = locale.key === this.config.defaultLocale;
        return isDefaultLocale ? this.docgeni.paths.absDocsPath : path.resolve(this.docgeni.paths.absDocsPath, locale.key);
    }

    private getIgnoreGlobs(localeKey: string) {
        return this.getLocaleKeys(localeKey).map(key => {
            return `**/${key}/**`;
        });
    }

    private getLocaleKeys(exclude: string) {
        return this.config.locales
            .filter(locale => {
                return locale.key !== exclude;
            })
            .map(locale => {
                return locale.key;
            });
    }

    private async buildDoc(docFileBuilder: DocSourceFile) {
        this.docgeni.hooks.docBuild.call(docFileBuilder);
        await docFileBuilder.build();
        this.docgeni.hooks.docBuildSucceed.call(docFileBuilder);
    }

    private async initializeDocFiles(locale: Locale) {
        const localeDocsPath = this.getLocaleDocsPath(locale);
        const ignoreGlobs = this.getIgnoreGlobs(locale.key);

        const allFiles = toolkit.fs.globSync(`/**/*.md`, {
            dot: true,
            root: localeDocsPath,
            exclude: ignoreGlobs
        });
        // init all doc files
        for (const filepath of allFiles) {
            const docFile = this.createDocSourceFile(locale, filepath);
            this.docFiles.set(docFile.path, docFile);
        }
    }

    private watchDocs(locale: Locale, localeDocsPath: string, ignoreGlobs: string | string[]) {
        const watcher = chokidar.watch(localeDocsPath, {
            cwd: this.docgeni.paths.cwd,
            ignoreInitial: true,
            interval: 1000,
            ignored: ignoreGlobs
        });
        this.watchers.push(watcher);
        ['add', 'change'].forEach(eventName => {
            watcher.on(eventName, async (filePath: string) => {
                this.docgeni.logger.info(`${filePath} ${eventName} ${locale.key}`);
                // watch filePath is relative path
                const absFilePath = path.resolve(this.docgeni.paths.cwd, filePath);
                let docFile = this.docFiles.get(absFilePath);
                if (!docFile) {
                    docFile = this.createDocSourceFile(locale, absFilePath);
                    this.docFiles.set(docFile.path, docFile);
                }
                this.docgeni.compile({
                    docs: [docFile]
                });
                // await this.buildDoc(docFile);
                // this.docgeni.hooks.docsBuildSucceed.call(this, [docFile]);
            });
        });
    }

    private createDocSourceFile(locale: Locale, absFilePath: string) {
        return new DocSourceFile(
            {
                locale: locale.key,
                cwd: this.docgeni.paths.cwd,
                base: this.docgeni.paths.cwd,
                path: absFilePath
            },
            this.docgeni.host
        );
    }
}
