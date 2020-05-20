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
    // site assets content path
    absSiteAssetsContentPath?: string;
    // site assets content docs path
    absSiteAssetsContentDocsPath?: string;
}

export interface ComponentDocMeta {
    category?: string;
    title: string;
    subtitle?: string;
    description?: string;
    order?: number;
}

export interface CategoryDocMeta {
    title: string;
    order?: number;
}

export interface GeneralDocMeta {
    title: string;
    path?: string;
    order?: number;
    category?: CategoryDocMeta;
}

export type DocMeta = ComponentDocMeta & GeneralDocMeta;

export interface DocSourceFile<TMeta = DocMeta> {
    absPath: string;
    content?: string;
    dirname: string;
    ext: string;
    basename: string;
    docType: DocType;
    result: {
        html: string;
        meta?: TMeta;
    };
}

// export interface DocOutputFile {
//     absPath: string;
//     content: string;
//     docType: DocType;
// }

// export interface DocFileContext {
//     source: DocSourceFile;
//     output?: DocOutputFile;
//     meta?: DocComponentMeta;
// }

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
