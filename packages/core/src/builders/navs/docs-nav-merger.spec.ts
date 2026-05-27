import { NavigationItem } from '../../interfaces';
import { mergeDocsNavs } from './docs-nav-merger';

function cloneNavs(navs: NavigationItem[]): NavigationItem[] {
    return JSON.parse(JSON.stringify(navs));
}

describe('#docs-nav-merger', () => {
    it('should merge docs nav into top-level config nav with same path', () => {
        const configNavs: NavigationItem[] = [
            {
                id: 'guides',
                path: 'guides',
                title: '指南',
                items: [],
            },
        ];
        const docsNavs: NavigationItem[] = [
            {
                id: 'guides',
                path: 'guides',
                channelPath: 'guides',
                title: 'Guide',
                items: [{ id: 'intro', path: 'guides/intro', title: 'Intro', items: [] }],
            },
            {
                id: 'reference',
                path: 'reference',
                channelPath: 'reference',
                title: 'Reference',
                items: [],
            },
        ];

        const navs = mergeDocsNavs(cloneNavs(configNavs), docsNavs, 0);

        expect(configNavs[0].items).toEqual([]);
        expect(navs[0].path).toBe('reference');
        expect(navs[1].title).toBe('指南');
        expect(navs[1].items).toEqual([{ id: 'intro', path: 'guides/intro', title: 'Intro', items: [] }]);
        expect(navs[1].channelPath).toBe('guides');
    });

    it('should merge docs nav into dropdown config nav children when parent path is empty', () => {
        const configNavs: NavigationItem[] = [
            {
                id: 'docs',
                path: '',
                title: '文档',
                items: [
                    { id: 'guides', path: 'guides', title: '指南', items: [] },
                    { id: 'reference', path: 'reference', title: '参考', items: [] },
                ],
            },
        ];
        const docsNavs: NavigationItem[] = [
            {
                id: 'guides',
                path: 'guides',
                channelPath: 'guides',
                title: 'Guide',
                items: [{ id: 'intro', path: 'guides/intro', title: 'Intro', items: [] }],
            },
            {
                id: 'reference',
                path: 'reference',
                channelPath: 'reference',
                title: 'Reference',
                items: [{ id: 'cli', path: 'reference/cli', title: 'CLI', items: [] }],
            },
            {
                id: 'configuration',
                path: 'configuration',
                channelPath: 'configuration',
                title: 'Configuration',
                items: [],
            },
        ];

        const navs = mergeDocsNavs(cloneNavs(configNavs), docsNavs, 0);

        expect(navs[0].path).toBe('configuration');
        expect(navs[1].path).toBe('');
        expect(navs[1].items[0].title).toBe('指南');
        expect(navs[1].items[0].items).toEqual([{ id: 'intro', path: 'guides/intro', title: 'Intro', items: [] }]);
        expect(navs[1].items[1].items).toEqual([{ id: 'cli', path: 'reference/cli', title: 'CLI', items: [] }]);
    });

    it('should prefer config nav values when properties conflict', () => {
        const configNavs: NavigationItem[] = [
            {
                id: 'guides-config',
                path: 'guides',
                title: '指南',
                subtitle: '配置副标题',
                items: [{ id: 'config-only', path: 'guides/config-only', title: 'Config Only', items: [] }],
            },
        ];
        const docsNavs: NavigationItem[] = [
            {
                id: 'guides-docs',
                path: 'guides',
                channelPath: 'guides',
                title: 'Guide',
                subtitle: 'Docs Subtitle',
                items: [{ id: 'intro', path: 'guides/intro', title: 'Intro', items: [] }],
            },
        ];

        const navs = mergeDocsNavs(cloneNavs(configNavs), docsNavs, 0);

        expect(navs.length).toBe(1);
        expect(navs[0].id).toBe('guides-config');
        expect(navs[0].title).toBe('指南');
        expect(navs[0].subtitle).toBe('配置副标题');
        expect(navs[0].items).toEqual([{ id: 'config-only', path: 'guides/config-only', title: 'Config Only', items: [] }]);
    });

    it('should not merge into external or lib config navs', () => {
        const configNavs: NavigationItem[] = [
            {
                id: 'components',
                path: 'components',
                lib: 'alib',
                title: '组件',
                items: [],
            },
            {
                id: 'github',
                path: 'https://github.com/docgeni/docgeni',
                isExternal: true,
                title: 'GitHub',
            },
        ];
        const docsNavs: NavigationItem[] = [
            {
                id: 'components',
                path: 'components',
                channelPath: 'components',
                title: 'Components',
                items: [{ id: 'button', path: 'components/button', title: 'Button', items: [] }],
            },
        ];

        const navs = mergeDocsNavs(cloneNavs(configNavs), docsNavs, 1);

        expect(navs[0].items).toEqual([]);
        expect(navs[1].path).toBe('components');
    });
});
