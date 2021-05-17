import { DocgeniHost } from './docgeni-host';
import { DocsBuilder } from './builders/docs-builder';
import { DocgeniConfig } from './interfaces';
import { SyncHook } from 'tapable';
import { Print } from '@docgeni/toolkit';
import { DocgeniPaths } from './docgeni-paths';
import { DocSourceFile, LibrariesBuilder } from './builders';
import { AngularCommandOptions } from './types';
import { virtualFs } from '@angular-devkit/core';

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
    readonly fs: virtualFs.Host;
    readonly host: DocgeniHost;
}
export interface DocgeniOptions {
    cwd?: string;
    watch?: boolean;
    presets?: string[];
    plugins?: string[];
    config?: DocgeniConfig;
    cmdArgs?: AngularCommandOptions;
    host?: DocgeniHost;
}
