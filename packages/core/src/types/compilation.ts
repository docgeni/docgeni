import { SyncHook } from 'tapable';
import { DocsBuilder, DocSourceFile } from '../builders';
import { HostWatchEvent } from '../fs';
import { EmitFile, EmitFiles } from './file';
import { LibraryBuilder } from './library-builder';
import { LibraryComponent } from './library-component';

export interface CompilationIncrement {
    docs?: DocSourceFile[];
    libraryBuilder?: LibraryBuilder;
    libraryComponents?: LibraryComponent[];
    changes?: HostWatchEvent[];
}

export interface CompilationResult {
    docs?: DocSourceFile[];
    components?: LibraryComponent[];
    componentFiles?: EmitFiles;
    files?: EmitFiles;
}

export interface DocgeniCompilation {
    hooks: {
        docBuild: SyncHook<DocSourceFile>;
        docBuildSucceed: SyncHook<DocSourceFile>;
        docsBuild: SyncHook<DocsBuilder, DocSourceFile[]>;
        docsBuildSucceed: SyncHook<DocsBuilder, DocSourceFile[]>;
        componentBuild: SyncHook<LibraryComponent>;
        componentBuildSucceed: SyncHook<LibraryComponent>;
        libraryBuild: SyncHook<LibraryBuilder, LibraryComponent[]>;
        libraryBuildSucceed: SyncHook<LibraryBuilder, LibraryComponent[]>;
        // 文档，类库都构建成功钩子
        buildSucceed: SyncHook;
        emitFileSucceed: SyncHook<EmitFile>;
        emitFilesSucceed: SyncHook<EmitFiles>;
        seal: SyncHook;
        finish: SyncHook;
    };
    run(): Promise<void>;
    getResult(): CompilationResult;
    addEmitFiles(path: string, content: EmitFile | string): void;
    addEmitFiles(files: EmitFiles): void;
    readonly increment: CompilationIncrement;
}
