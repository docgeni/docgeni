import { toolkit } from '@docgeni/toolkit';
import { getSystemPath, normalize } from '@angular-devkit/core';
import { DocgeniPaths } from '../docgeni-paths';
import { DocgeniContext } from '../docgeni.interface';
import { DocgeniLibrary } from '../interfaces';
import { createTestDocgeniHost } from './docgeni-host';
import { AsyncSeriesHook, SyncHook } from 'tapable';
import { DocSourceFile } from '../builders/doc-file';
import { DocsBuilder } from '../builders';
import { DocgeniCompilation, LibraryBuilder, LibraryComponent } from '../types';

export const DEFAULT_TEST_ROOT_PATH = normalize(`/D/test`);

export interface TestDocgeniContextOptions {
    root?: string;
    initialFiles?: Record<string, string>;
    libs?: DocgeniLibrary[] | DocgeniLibrary;
}

const DEFAULT_OPTIONS = {
    root: DEFAULT_TEST_ROOT_PATH,
    libs: []
};

export function createTestDocgeniContext(options?: TestDocgeniContextOptions): DocgeniContext {
    options = { ...DEFAULT_OPTIONS, ...options };
    const paths = new DocgeniPaths(options.root, 'docs', 'dist/docgeni-site');
    paths.setSitePaths('.docgeni/site', '.docgeni/site/src');
    return {
        host: createTestDocgeniHost(options.initialFiles),
        config: {
            componentsDir: '.docgeni/components',
            libs: toolkit.utils.coerceArray(options.libs || []),
            locales: [
                {
                    key: 'zh-cn',
                    name: 'ZH'
                },
                {
                    key: 'en-us',
                    name: 'EN'
                }
            ],
            defaultLocale: 'zh-cn'
        },
        watch: true,
        paths: paths,
        hooks: {
            run: new SyncHook([]),
            docBuild: new SyncHook<DocSourceFile>(['docSourceFile']),
            docBuildSucceed: new SyncHook<DocSourceFile>(['docSourceFile']),
            docsBuild: new SyncHook<DocsBuilder, DocSourceFile[]>(['docsBuilder', 'docs']),
            docsBuildSucceed: new SyncHook<DocsBuilder, DocSourceFile[]>(['docsBuilder', 'docs']),
            componentBuild: new SyncHook<LibraryComponent>(['component']),
            componentBuildSucceed: new SyncHook<LibraryComponent>(['component']),
            libraryBuild: new SyncHook<LibraryBuilder, LibraryComponent[]>(['libraryBuilder', 'components']),
            libraryBuildSucceed: new SyncHook<LibraryBuilder, LibraryComponent[]>(['libraryBuilder', 'components']),
            compilation: new SyncHook<DocgeniCompilation>(['compilation', 'compilationIncrement']),
            emit: new AsyncSeriesHook<void>([])
        },
        logger: toolkit.print,
        librariesBuilder: null,
        docsBuilder: null,
        navsBuilder: null,
        fs: null,
        enableIvy: null,
        compile: () => {
            return Promise.resolve();
        },
        version: '1.0.0'
    };
}
