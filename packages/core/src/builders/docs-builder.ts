import { SyncHook, AsyncSeriesHook } from 'tapable';
import { DocgeniContext } from '../docgeni.interface';
import { DocSourceFile } from './doc-file';
import path from 'path';
import { toolkit } from '@docgeni/toolkit';
import { Locale } from '../interfaces';
import chokidar from 'chokidar';

export class DocsBuilder {
    private docFiles = new Map<string, DocSourceFile>();

    private watchers: chokidar.FSWatcher[] = [];

    public hooks = {
        buildDoc: new SyncHook<DocSourceFile>(['docBuilder']),
        buildDocSucceed: new SyncHook<DocSourceFile>(['docBuilder']),
        buildDocs: new AsyncSeriesHook<DocsBuilder>(['docsBuilder']),
        buildDocsSucceed: new SyncHook<DocsBuilder>(['docsBuilder'])
    };

    private get config() {
        return this.docgeni.config;
    }

    public get docs() {
        return this.docFiles;
    }

    constructor(private docgeni: DocgeniContext) {}

    public async build() {
        for (const locale of this.config.locales) {
            await this.buildForLocale(locale);
        }

        this.hooks.buildDocsSucceed.call(this);
    }

    public async emit() {
        for (const file of this.docFiles.values()) {
            await file.emit(this.docgeni.paths.absSiteAssetsContentPath);
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
        this.hooks.buildDoc.call(docFileBuilder);
        await docFileBuilder.build();
        this.hooks.buildDocSucceed.call(docFileBuilder);
    }

    private async buildForLocale(locale: Locale) {
        const localeDocsPath = this.getLocaleDocsPath(locale);
        const ignoreGlobs = this.getIgnoreGlobs(locale.key);

        const allFiles = toolkit.fs.globSync(`/**/*.md`, {
            dot: true,
            root: localeDocsPath,
            exclude: ignoreGlobs
        });
        // build all doc files
        for (const filepath of allFiles) {
            const docFile = this.createDocSourceFile(locale, filepath);
            this.docFiles.set(docFile.path, docFile);
            await this.buildDoc(docFile);
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
                await this.buildDoc(docFile);
                this.hooks.buildDocsSucceed.call(this);
            });
        });
    }

    private createDocSourceFile(locale: Locale, absFilePath: string) {
        return new DocSourceFile({
            locale: locale.key,
            cwd: this.docgeni.paths.cwd,
            base: this.docgeni.paths.cwd,
            path: absFilePath
        });
    }
}
