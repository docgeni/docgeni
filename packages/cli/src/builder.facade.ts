import { DocgeniConfig } from './interfaces';
import { SyncHook, AsyncSeriesHook } from 'tapable';

export interface BuilderPaths {
    cwd: string;
    absDocsPath?: string;
    absOutputPath?: string;
    // site path, default site
    absSitePath?: string;
    // site docs content path
    absSiteContentPath?: string;
}

export interface DocSourceFile {
    absPath: string;
    content: string;
    dirname: string;
    ext: string;
    basename: string;
}

export interface BuilderHooks {
    run: SyncHook;
    docCompile: SyncHook<DocSourceFile>;
    docsCompile: SyncHook<DocSourceFile[]>;
    emit: SyncHook<unknown>;
}
export interface BuilderFacade {
    watch: boolean;
    readonly config: DocgeniConfig;
    readonly paths: BuilderPaths;
    hooks: BuilderHooks;
}
