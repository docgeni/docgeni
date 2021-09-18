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
import { Docgeni } from '../docgeni';

export const DEFAULT_TEST_ROOT_PATH = normalize(`/D/test`);

export interface TestDocgeniContextOptions {
    root?: string;
    initialFiles?: Record<string, string>;
    libs?: DocgeniLibrary[] | DocgeniLibrary;
    watch?: boolean;
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
            siteDir: '.docgeni/site',
            outputDir: 'dist/docgeni-site',
            publicDir: '.docgeni/public',
            defaultLocale: 'zh-cn'
        },
        watch: options.watch,
        paths: paths,
        hooks: Docgeni.createHooks(),
        logger: toolkit.print,
        librariesBuilder: null,
        docsBuilder: null,
        navsBuilder: null,
        fs: null,
        enableIvy: true,
        compile: () => {
            return Promise.resolve();
        },
        version: '1.0.0'
    };
}
