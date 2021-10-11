import { SyncHook, AsyncSeriesHook } from 'tapable';
import { DocgeniContext } from '../docgeni.interface';
import { DocSourceFile } from './doc-file';
import { toolkit } from '@docgeni/toolkit';
import { FileEmitter } from './emitter';
import { getSystemPath, HostWatchEventType, normalize, resolve } from '../fs';

export class DocsBuilder extends FileEmitter {
    private docFiles = new Map<string, DocSourceFile>();

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
        await this.initializeDocFiles();
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
                    } else {
                        if (docFile) {
                            addDocs.push(docFile);
                        }
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

    private async buildDoc(docFileBuilder: DocSourceFile) {
        this.docgeni.hooks.docBuild.call(docFileBuilder);
        await docFileBuilder.build();
        this.docgeni.hooks.docBuildSucceed.call(docFileBuilder);
    }

    private async initializeDocFiles() {
        const allFiles = toolkit.fs.globSync(`/**/*.md`, {
            dot: true,
            root: getSystemPath(this.docgeni.paths.absDocsPath)
        });
        // init all doc files
        for (const filepath of allFiles) {
            const absFilePath = normalize(filepath);
            const docFile = this.createDocSourceFile(this.getLocaleByAbsPath(absFilePath), absFilePath);
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
