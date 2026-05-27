import { DocgeniContext } from '../docgeni.interface';
import { DocItem } from '../interfaces';
import { assertExpectedFiles, createTestDocgeniContext, DEFAULT_TEST_ROOT_PATH, FixtureResult, loadFixture } from '../testing';
import { toolkit } from '@docgeni/toolkit';
import * as systemPath from 'path';
import SitemapPlugin from './sitemap';

const DEFAULT_SITE_PATH = `${DEFAULT_TEST_ROOT_PATH}/.docgeni/site`;

function createDocItem(path: string, channelPath?: string): DocItem {
    return {
        id: path,
        title: path,
        path,
        channelPath,
    };
}

describe('#sitemap-plugin', () => {
    let context: DocgeniContext;
    let fixture: FixtureResult;
    let sitemapPlugin: SitemapPlugin;

    beforeAll(async () => {
        toolkit.initialize({
            baseDir: systemPath.resolve(__dirname, '../'),
        });
        fixture = await loadFixture('default-site');
    });

    beforeEach(() => {
        context = createTestDocgeniContext({
            initialFiles: {},
        });
        sitemapPlugin = new SitemapPlugin();
        sitemapPlugin.apply(context);
    });

    describe('#generateUrls', () => {
        it('should use doc path only and ignore channelPath', () => {
            const urls = sitemapPlugin.generateUrls(context, {
                'en-us': [createDocItem('guides/intro', 'guides')],
            });

            expect(urls).toContain('https://test.org/guides/intro');
            expect(urls).toContain('https://test.org/en-us/guides/intro');
            expect(urls.some((url) => url.includes('guides/guides'))).toBe(false);
        });

        it('should skip items with empty path', () => {
            const urls = sitemapPlugin.generateUrls(context, {
                'en-us': [createDocItem('')],
            });

            expect(urls).toEqual([]);
        });

        it('should generate urls for each configured locale', () => {
            const urls = sitemapPlugin.generateUrls(context, {
                'zh-cn': [createDocItem('guides/start')],
                'en-us': [createDocItem('guides/getting-started')],
            });

            expect(urls).toContain('https://test.org/guides/start');
            expect(urls).toContain('https://test.org/zh-cn/guides/start');
            expect(urls).toContain('https://test.org/guides/getting-started');
            expect(urls).toContain('https://test.org/en-us/guides/getting-started');
        });

        it('should dedupe default locale url when duplicated', () => {
            const urls = sitemapPlugin.generateUrls(context, {
                'en-us': [createDocItem('same-page'), createDocItem('same-page')],
            });

            const defaultUrls = urls.filter((url) => url === 'https://test.org/same-page');
            expect(defaultUrls.length).toBe(1);
            expect(urls.filter((url) => url === 'https://test.org/en-us/same-page').length).toBe(2);
        });

        it('should normalize host without trailing slash', () => {
            context.config.sitemap = { host: 'https://example.com' };
            const urls = sitemapPlugin.generateUrls(context, {
                'en-us': [createDocItem('page-a')],
            });

            expect(urls).toEqual(['https://example.com/page-a', 'https://example.com/en-us/page-a']);
        });
    });

    it('should create sitemap.xml success', async () => {
        await context.hooks.navsEmitSucceed.call(undefined, {
            'en-us': [createDocItem('front-matter', 'configuration')],
        });
        await assertExpectedFiles(
            context.host,
            {
                [`${DEFAULT_SITE_PATH}/src/sitemap.xml`]: fixture.src['sitemap.xml'],
            },
            true,
        );
    });

    it('should not register hook when sitemap host is not configured', () => {
        const contextWithoutSitemap = createTestDocgeniContext({
            initialFiles: {},
        });
        contextWithoutSitemap.config.sitemap = undefined;

        const plugin = new SitemapPlugin();
        plugin.apply(contextWithoutSitemap);

        expect(contextWithoutSitemap.hooks.navsEmitSucceed.taps.length).toBe(0);
    });
});
