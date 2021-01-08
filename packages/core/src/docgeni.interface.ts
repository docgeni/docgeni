import { DocsBuilder } from './builders/docs-builder';
import { DocgeniConfig, Library, HomeDocMeta } from './interfaces';
import { SyncHook } from 'tapable';
import { DocType } from './enums';
import { Print } from '@docgeni/toolkit';
import { DocgeniPaths } from './docgeni-paths';
import { DocSourceFile, LibrariesBuilder } from './builders';

export interface ComponentDocMeta {
    title?: string;
    name?: string;
    category?: string;
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
}

export type DocMeta = ComponentDocMeta & GeneralDocMeta & HomeDocMeta;

export interface SiteProject {
    name: string;
    root: string;
    sourceRoot?: string;
    custom?: boolean;
}

export interface LibraryContext {
    lib: Library;
}

export interface LibraryComponentContext {
    name: string;
}

export interface DocgeniHooks {
    run: SyncHook;
    docBuild: SyncHook<DocSourceFile>;
    docBuildSucceed: SyncHook<DocSourceFile>;
    // libBuild: SyncHook<LibraryContext>;
    // componentBuild: SyncHook<LibraryContext, LibraryComponentContext>;
    emit: SyncHook<unknown>;
}

export interface DocgeniContext {
    readonly watch: boolean;
    readonly config: DocgeniConfig;
    readonly paths: DocgeniPaths;
    readonly hooks: DocgeniHooks;
    readonly logger: Print;
    readonly enableIvy: boolean;
    readonly librariesBuilders: LibrariesBuilder;
    readonly docsBuilder: DocsBuilder;
}

export interface AngularCommandOptions {
    skipSite?: boolean;
    port?: string | number;
    prod?: boolean;
    deployUrl?: string;
    baseHref?: string;
}

export interface DocgeniOptions {
    cwd?: string;
    watch?: boolean;
    presets?: string[];
    plugins?: string[];
    config: DocgeniConfig;
    cmdArgs: AngularCommandOptions;
}
