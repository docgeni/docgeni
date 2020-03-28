import { DocgConfig } from './interfaces';
import { SyncHook } from 'tapable';

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

export interface BuilderFacade {
    watch: boolean;
    readonly config: DocgConfig;
    readonly paths: BuilderPaths;
    hooks: {
        docCompile: SyncHook<DocSourceFile>;
        // docsCompile: SyncHook<DocSourceFile[]>;
    };
}
