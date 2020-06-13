import { DocgeniConfig, Library, HomeDocMeta } from './interfaces';
import { SyncHook, AsyncSeriesHook } from 'tapable';
import { DocType } from './enums';
import { Print } from '@docgeni/toolkit';
import { DocgeniPaths } from './docgeni-paths';

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
    path?: string;
}

export interface GeneralDocMeta {
    title: string;
    path?: string;
    order?: number;
    // category?: CategoryDocMeta;
}

export type DocMeta = ComponentDocMeta & GeneralDocMeta & HomeDocMeta;

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

export interface SiteProject {
    name: string;
    root: string;
    sourceRoot?: string;
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
    readonly enableIvy: boolean;
}

export interface AngularCommandOptions {
    prod: boolean;
    skipSite?: boolean;
}

export interface DocgeniOptions {
    cwd?: string;
    watch?: boolean;
    presets?: string[];
    plugins?: string[];
    config: DocgeniConfig;
    cmdArgs: AngularCommandOptions;
}
