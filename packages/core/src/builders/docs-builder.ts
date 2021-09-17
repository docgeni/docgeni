import { SyncHook, AsyncSeriesHook } from 'tapable';
import { DocgeniContext } from '../docgeni.interface';
import { DocSourceFile } from './doc-file';
import path from 'path';
import { toolkit } from '@docgeni/toolkit';
import { Locale } from '../interfaces';
import chokidar from 'chokidar';
import { FileEmitter } from './emitter';
import { HostWatchEventType, normalize, resolve } from '../fs';

export class DocsBuilder extends FileEmitter {
    private docFiles = new Map<string, DocSourceFile>();

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
        this.resetEmitted();
    }

    public async onEmit() {
        for (const file of this.docFiles.values()) {
            const { outputPath, content } = await file.emit(this.docgeni.paths.absSiteAssetsContentPath);
            this.addEmitFile(outputPath, content);
        }
    }

    public async clear() {
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
            this.docgeni.host.watchAggregated(this.docgeni.paths.absDocsPath, { ignoreInitial: true }).subscribe(events => {
                const addDocs = [];
                events.forEach(event => {
                    let docFile = this.docFiles.get(event.path);
                    if (!docFile) {
                        docFile = this.createDocSourceFile(this.getLocaleByAbsPath(event.path), event.path);
                        this.docFiles.set(event.path, docFile);
                    }
                    if (event.type === HostWatchEventType.Deleted) {
                        docFile.clear();
                        this.docFiles.delete(event.path);
                    }
                    if (docFile) {
                        addDocs.push(docFile);
                    }
                });
                this.docgeni.compile({
                    docs: addDocs,
                    changes: events
                });
            });
        }
    }

    private getLocaleByAbsPath(filePath: string) {
        const locale = this.docgeni.config.locales.find(locale => {
            return filePath.startsWith(resolve(this.docgeni.paths.absDocsPath, locale.key + '/'));
        });
        return locale ? locale.key : this.docgeni.config.defaultLocale;
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
            const docFile = this.createDocSourceFile(locale.key, normalize(filepath));
            this.docFiles.set(docFile.path, docFile);
        }
    }

    private createDocSourceFile(locale: string, absFilePath: string) {
        return new DocSourceFile(
            {
                locale: locale,
                cwd: this.docgeni.paths.cwd,
                base: this.docgeni.paths.cwd,
                path: absFilePath
            },
            this.docgeni.host
        );
    }
}
