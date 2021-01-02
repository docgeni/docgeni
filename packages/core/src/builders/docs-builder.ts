import { SyncHook, AsyncSeriesHook } from 'tapable';
import { DocgeniContext } from '../docgeni.interface';
import { DocFileBuilder } from './doc-file-builder';
import * as path from 'path';
import { toolkit } from '@docgeni/toolkit';
import { Locale } from '../interfaces';
import * as chokidar from 'chokidar';

export class DocsBuilder {
    private docFileBuilders = new Map<string, DocFileBuilder>();

    private watchers: chokidar.FSWatcher[] = [];

    public hooks = {
        buildDoc: new SyncHook<DocFileBuilder>(['docBuilder']),
        buildDocSucceed: new SyncHook<DocFileBuilder>(['docBuilder']),
        buildDocs: new AsyncSeriesHook<DocsBuilder>(['docsBuilder']),
        buildDocsSucceed: new SyncHook<DocsBuilder>(['docsBuilder'])
    };

    private get config() {
        return this.docgeni.config;
    }

    public get fileBuilders() {
        return this.docFileBuilders;
    }

    constructor(private docgeni: DocgeniContext) {}

    public async build() {
        for (const locale of this.config.locales) {
            await this.buildForLocale(locale);
        }

        this.hooks.buildDocsSucceed.call(this);
    }

    public async emit() {
        for (const file of this.docFileBuilders.values()) {
            await file.emit(this.docgeni.paths.absSiteAssetsContentPath);
        }
    }

    public async clear() {
        this.watchers.forEach(watcher => {
            watcher.close();
        });
        this.watchers = [];
        delete this.docFileBuilders;
        this.docFileBuilders = new Map<string, DocFileBuilder>();
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

    private async buildDoc(docFileBuilder: DocFileBuilder) {
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
            const docFileBuilder = this.createDocFileBuilder(locale, filepath);
            this.docFileBuilders.set(docFileBuilder.path, docFileBuilder);
            await this.buildDoc(docFileBuilder);
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
                let docFileBuilder = this.docFileBuilders.get(filePath);
                if (!docFileBuilder) {
                    // watch filePath is relative path
                    docFileBuilder = this.createDocFileBuilder(locale, path.resolve(this.docgeni.paths.cwd, filePath));
                }
                await this.buildDoc(docFileBuilder);
                this.hooks.buildDocsSucceed.call(this);
            });
        });
    }

    private createDocFileBuilder(locale: Locale, absFilePath: string) {
        return new DocFileBuilder({
            locale: locale.key,
            cwd: this.docgeni.paths.cwd,
            base: this.docgeni.paths.cwd,
            path: absFilePath
        });
    }
}
