import { toolkit } from '@docgeni/toolkit';
import { SyncHook } from 'tapable';
import { DocgeniContext } from './docgeni.interface';
import {
    CompilationResult,
    CompilationIncrement,
    DocgeniCompilation,
    EmitFile,
    EmitFiles,
    LibraryBuilder,
    LibraryComponent
} from './types';

export class DocgeniCompilationImpl implements DocgeniCompilation {
    private emits: CompilationResult;

    private preparedEmitFiles: EmitFiles = {};

    public hooks = {
        docBuild: this.docgeni.hooks.docBuild,
        docBuildSucceed: this.docgeni.hooks.docBuildSucceed,
        docsBuild: this.docgeni.hooks.docsBuild,
        docsBuildSucceed: this.docgeni.hooks.docsBuildSucceed,
        componentBuild: this.docgeni.hooks.componentBuild,
        componentBuildSucceed: this.docgeni.hooks.componentBuildSucceed,
        libraryBuild: this.docgeni.hooks.libraryBuild,
        libraryBuildSucceed: this.docgeni.hooks.libraryBuildSucceed,
        buildSucceed: new SyncHook(),
        emitFileSucceed: new SyncHook<EmitFile>(),
        emitFilesSucceed: new SyncHook<EmitFiles>(),
        seal: new SyncHook(),
        finish: new SyncHook()
    };

    public increment: CompilationIncrement;

    constructor(private docgeni: DocgeniContext, increment?: CompilationIncrement) {
        this.increment = increment;
    }

    async run() {
        this.preparedEmitFiles = {};
        this.emits = {
            docs: [],
            components: [],
            componentFiles: {},
            files: {}
        };
        if (this.increment) {
            if (this.increment.libraryBuilder && this.increment.libraryComponents) {
                await this.increment.libraryBuilder.build(this.increment.libraryComponents);
                this.docgeni.librariesBuilder.resetEmitted();
                this.emits.componentFiles = await this.docgeni.librariesBuilder.emit();
                this.emits.components = this.increment.libraryComponents;
            }
            if (this.increment.docs) {
                await this.docgeni.docsBuilder.build(this.increment.docs);
                await this.docgeni.docsBuilder.emit();
                this.emits.docs = this.increment.docs;
            }
            await this.docgeni.navsBuilder.build();
            await this.docgeni.navsBuilder.emit();
        } else {
            await this.docgeni.docsBuilder.initialize();
            await this.docgeni.librariesBuilder.initialize();

            await this.docgeni.docsBuilder.build();
            await this.docgeni.librariesBuilder.build();

            await this.docgeni.docsBuilder.emit();
            this.emits.componentFiles = await this.docgeni.librariesBuilder.emit();
            await this.docgeni.navsBuilder.run();

            this.emits.components = [];
            this.docgeni.librariesBuilder.libraries.forEach(libraryBuilder => {
                this.emits.components.push(...libraryBuilder.components.values());
            });
            this.emits.docs = this.docgeni.docsBuilder.getDocs();

            this.docgeni.docsBuilder.watch();
            this.docgeni.librariesBuilder.watch();
        }
        this.hooks.buildSucceed.call();
        for (const path in this.preparedEmitFiles) {
            const file = this.preparedEmitFiles[path];
            await this.docgeni.host.writeFile(path, toolkit.utils.isString(file) ? file : file.content);
        }
        await this.seal();
        this.hooks.finish.call();
    }

    async seal() {
        this.hooks.seal.call();
    }

    getResult() {
        return this.emits;
    }

    addEmitFiles(path: string, content: string | EmitFile): void;
    addEmitFiles(files: EmitFiles): void;
    addEmitFiles(path: string | EmitFiles, content?: string | EmitFile): void {
        if (toolkit.utils.isString(path)) {
            this.preparedEmitFiles[path] = content;
        } else {
            Object.assign(this.preparedEmitFiles, path);
        }
    }
}
