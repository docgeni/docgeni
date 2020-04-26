import { DocgeniConfig, Library } from './interfaces';
import { SyncHook, AsyncSeriesHook } from 'tapable';
import { DocType } from './enums';
import { Print } from '@docgeni/toolkit';

export interface DocgeniPaths {
    cwd: string;
    absDocsPath?: string;
    absOutputPath?: string;
    // site path, default site
    absSitePath?: string;
    // site docs content path
    absSiteContentPath?: string;
}

export interface DocComponentMeta {
    category: string;
    title: string;
    subtitle: string;
    description?: string;
}

export interface DocSourceFile {
    absPath: string;
    content?: string;
    dirname: string;
    ext: string;
    basename: string;
    docType: DocType;
    importSpecifier?: string;
    result: {
        html: string;
        meta?: DocComponentMeta;
    };
}

export interface LibraryContext {
    lib: Library;
}

export interface LibraryComponentContext {
    name: string;
}

export interface DocgeniHooks {
    run: SyncHook;
    docCompile: SyncHook<DocSourceFile>;
    docsCompile: SyncHook<DocSourceFile[]>;
    libCompile: SyncHook<LibraryContext>;
    libComponentCompile: SyncHook<LibraryContext, LibraryComponentContext>;
    emit: SyncHook<unknown>;
}

export interface DocgeniContext {
    readonly watch: boolean;
    readonly config: DocgeniConfig;
    readonly paths: DocgeniPaths;
    readonly hooks: DocgeniHooks;
    readonly logger: Print;
    getAbsPath(absOrRelativePath: string): string;
}

export interface DocgeniOptions {
    cwd?: string;
    watch?: boolean;
    presets?: string[];
    plugins?: string[];
}
