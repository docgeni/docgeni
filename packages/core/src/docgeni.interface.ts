import { DocgeniHost } from './docgeni-host';
import { DocsBuilder } from './builders/docs-builder';
import { DocgeniConfig, DocItem } from './interfaces';
import { AsyncSeriesHook, SyncHook } from 'tapable';
import { Print } from '@docgeni/toolkit';
import { DocgeniPaths } from './docgeni-paths';
import { DocSourceFile, LibrariesBuilder, NavsBuilder } from './builders';
import { CompilationIncrement, DocgeniCompilation, LibraryBuilder, LibraryComponent } from './types';
import { virtualFs } from '@angular-devkit/core';

export interface DocgeniHooks {
    beforeRun: AsyncSeriesHook;
    run: AsyncSeriesHook;
    done: AsyncSeriesHook;
    docBuild: SyncHook<DocSourceFile>;
    docBuildSucceed: SyncHook<DocSourceFile>;
    docsBuild: SyncHook<DocsBuilder, DocSourceFile[]>;
    docsBuildSucceed: SyncHook<DocsBuilder, DocSourceFile[]>;
    componentBuild: SyncHook<LibraryComponent>;
    componentBuildSucceed: SyncHook<LibraryComponent>;
    libraryBuild: SyncHook<LibraryBuilder, LibraryComponent[]>;
    libraryBuildSucceed: SyncHook<LibraryBuilder, LibraryComponent[]>;
    navsEmitSucceed: SyncHook<NavsBuilder, Record<string, DocItem[]>>;
    compilation: SyncHook<DocgeniCompilation, CompilationIncrement>;
    emit: SyncHook<unknown>;
}
export interface DocgeniContext {
    readonly version: string;
    readonly watch: boolean;
    readonly config: DocgeniConfig;
    readonly paths: DocgeniPaths;
    readonly hooks: DocgeniHooks;
    readonly logger: Print;
    enableIvy: boolean;
    readonly librariesBuilder: LibrariesBuilder;
    readonly docsBuilder: DocsBuilder;
    readonly navsBuilder: NavsBuilder;
    readonly fs: virtualFs.Host;
    readonly host: DocgeniHost;
    compile(increment?: CompilationIncrement): Promise<void>;
}

export interface DocgeniOptions {
    cwd?: string;
    watch?: boolean;
    presets?: string[];
    plugins?: string[];
    config?: DocgeniConfig;
    host?: DocgeniHost;
    version?: string;
    progress?: boolean;
}
