import { toolkit } from '@docgeni/toolkit';
import { normalize } from '@angular-devkit/core';
import { DocgeniPaths } from '../docgeni-paths';
import { DocgeniContext } from '../docgeni.interface';
import { DocgeniConfig, DocgeniLibrary, DocgeniTheme } from '../interfaces';
import { createTestDocgeniFsHost } from '@docgeni/toolkit/src/testing';
import { DocsBuilder, LibrariesBuilder } from '../builders';
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
    libs: [],
};

export function createTestDocgeniContext(options?: TestDocgeniContextOptions): DocgeniContext {
    options = { ...DEFAULT_OPTIONS, ...options };
    const paths = new DocgeniPaths(options.root, 'docs', 'dist/docgeni-site');
    paths.setSitePaths('.docgeni/site', '.docgeni/site/src');
    const context: DocgeniContext = {
        host: createTestDocgeniFsHost(options.initialFiles),
        config: {
            componentsDir: '.docgeni/components',
            libs: toolkit.utils.coerceArray(options.libs || []),
            locales: [
                {
                    key: 'zh-cn',
                    name: 'ZH',
                },
                {
                    key: 'en-us',
                    name: 'EN',
                },
            ],
            defaultLocale: 'en-us',
            switchTheme: false,
            siteDir: '.docgeni/site',
            outputDir: 'dist/docgeni-site',
            publicDir: '.docgeni/public',
            sitemap: {
                host: 'https://test.org',
            },
            navs: [],
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
        version: '1.0.0',
    };
    Object.assign(context, {
        librariesBuilder: new LibrariesBuilder(context),
        docsBuilder: new DocsBuilder(context),
    });
    return context;
}

export function updateContext(context: DocgeniContext, update: Partial<DocgeniContext>) {
    Object.assign(context, update);
}

export function updateContextConfig(context: DocgeniContext, update: Partial<DocgeniConfig> | Record<string, any>) {
    Object.assign(context.config, update);
}
