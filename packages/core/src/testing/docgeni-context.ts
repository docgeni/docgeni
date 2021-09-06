import { toolkit } from '@docgeni/toolkit';
import { getSystemPath, normalize } from '@angular-devkit/core';
import { DocgeniPaths } from '../docgeni-paths';
import { DocgeniContext } from '../docgeni.interface';
import { DocgeniLibrary } from '../interfaces';
import { createTestDocgeniHost } from './docgeni-host';

export const DEFAULT_TEST_ROOT_PATH = getSystemPath(normalize(`/D/test/root`));

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
            libs: toolkit.utils.coerceArray(options.libs || [])
        },
        watch: false,
        paths: paths,
        hooks: null,
        logger: null,
        librariesBuilders: null,
        docsBuilder: null,
        fs: null,
        enableIvy: null
    };
}
