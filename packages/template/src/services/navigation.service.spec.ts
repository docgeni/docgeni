import { NavigationService } from './navigation.service';
import { createServiceFactory, createHttpFactory, SpectatorService, HttpMethod } from '@ngneat/spectator';
import { GlobalContext } from './global-context';

const mockGlobalContext = {
    navs: [
        {
            id: 'guides',
            path: 'guides',
            title: 'Guide',
            items: [
                {
                    id: 'guides/intro',
                    path: 'guides/intro',
                    channelPath: 'guides',
                    title: '介绍',
                    items: [
                        {
                            id: 'index',
                            path: 'intro',
                            channelPath: 'guides',
                            title: '介绍',
                            order: 10,
                            contentPath: 'docs/guides/intro/index.html',
                        },
                        {
                            id: 'getting-started',
                            path: 'intro/getting-started',
                            channelPath: 'guides',
                            title: '快速开始',
                            order: 30,
                            contentPath: 'docs/guides/intro/getting-started.html',
                        },
                    ],
                },
            ],
        },
        {
            id: 'configuration',
            path: 'configuration',
            title: 'Configuration',
            items: [
                {
                    id: 'global',
                    path: 'global',
                    channel_path: 'configuration',
                    title: '全局配置',
                    order: 30,
                    contentPath: 'docs/configuration/global.html',
                },
            ],
        },
        {
            id: 'components',
            path: 'components',
            title: 'Components',
            lib: 'alib',
            items: [
                {
                    id: 'general',
                    title: '通用',
                    items: [
                        {
                            id: 'button',
                            title: 'Button',
                            subtitle: '按钮',
                            path: 'button',
                            importSpecifier: 'alib/button',
                            examples: ['alib-button-basic-example', 'alib-button-advance-title-example', 'alib-button-advance-example'],
                            overview: true,
                            api: true,
                            order: 1,
                            category: 'general',
                        },
                        {
                            id: 'foo',
                            title: 'Foo',
                            subtitle: '测试',
                            path: 'foo',
                            importSpecifier: 'alib/foo',
                            examples: ['alib-foo-advance-example', 'alib-foo-basic-example'],
                            overview: true,
                            api: false,
                            order: 2,
                            category: 'general',
                        },
                    ],
                },
            ],
        },
        {
            id: 'b-components',
            path: 'b-components',
            title: 'B Components',
            lib: 'blib',
            items: [],
        },
    ],
    docItems: [
        {
            id: 'index',
            path: 'intro',
            channelPath: 'guides',
            title: '介绍',
            order: 10,
            contentPath: 'docs/guides/intro/index.html',
        },
        {
            id: 'getting-started',
            path: 'intro/getting-started',
            channelPath: 'guides',
            title: '快速开始',
            order: 30,
            contentPath: 'docs/guides/intro/getting-started.html',
        },
        {
            id: 'global',
            path: 'global',
            channelPath: 'configuration',
            title: '全局配置',
            order: 30,
            contentPath: 'docs/configuration/global.html',
        },
        {
            id: 'button',
            title: 'Button',
            subtitle: '按钮',
            path: 'button',
            importSpecifier: 'alib/button',
            channelPath: 'components',
            examples: ['alib-button-basic-example', 'alib-button-advance-title-example', 'alib-button-advance-example'],
            overview: true,
            api: true,
            order: 1,
            category: 'general',
        },
        {
            id: 'foo',
            title: 'Foo',
            subtitle: '测试',
            path: 'foo',
            importSpecifier: 'alib/foo',
            channelPath: 'components',
            examples: ['alib-foo-advance-example', 'alib-foo-basic-example'],
            overview: true,
            api: false,
            order: 2,
            category: 'general',
        },
    ],
    config: {
        defaultLocale: 'zh-cn',
    },
};
describe('NavigationService', () => {
    let spectator: SpectatorService<NavigationService>;
    const createService = createServiceFactory({
        service: NavigationService,
        providers: [
            {
                provide: GlobalContext,
                useValue: mockGlobalContext,
            },
        ],
        mocks: [],
    });

    beforeEach(() => {
        spectator = createService();
    });

    it('should create success', () => {
        expect(spectator.service).toBeTruthy();
        expect(spectator.service instanceof NavigationService).toBeTruthy();
    });

    describe('channel', () => {
        it('should get channel success', () => {
            const channel = spectator.service.getChannel('guides');
            expect(channel).toBeTruthy();
            expect(channel.path).toEqual('guides');

            const componentChannel = spectator.service.getChannel('components');
            expect(componentChannel).toBeTruthy();
            expect(componentChannel.path).toEqual('components');
            expect(componentChannel.lib).toEqual('alib');
        });

        it('should get channel fail', () => {
            const channel = spectator.service.getChannel('guide-01');
            expect(channel).toBeFalsy();
        });
    });

    it('should get doc item by path [intro/getting-started] success', () => {
        spectator.service.selectChannelByPath('guides');
        const docItem = spectator.service.getDocItemByPath('intro/getting-started');
        expect(docItem).toEqual({
            id: 'getting-started',
            path: 'intro/getting-started',
            channelPath: 'guides',
            title: '快速开始',
            order: 30,
            contentPath: 'docs/guides/intro/getting-started.html',
        });
    });

    it('should get doc item in channel', () => {
        const originalDocItems = mockGlobalContext.docItems;

        mockGlobalContext.docItems = [
            {
                id: 'getting-started',
                path: 'intro/getting-started',
                channelPath: 'configuration',
                title: '快速开始',
                order: 30,
                contentPath: 'docs/guides/intro/getting-started.html',
            },
            ...originalDocItems,
        ];
        spectator.service.selectChannelByPath('guides');
        const docItem = spectator.service.getDocItemByPath('intro/getting-started');
        expect(docItem).toEqual({
            id: 'getting-started',
            path: 'intro/getting-started',
            channelPath: 'guides',
            title: '快速开始',
            order: 30,
            contentPath: 'docs/guides/intro/getting-started.html',
        });

        mockGlobalContext.docItems = originalDocItems;
    });

    it('should get doc item in lib channel', () => {
        const originalDocItems = mockGlobalContext.docItems;

        mockGlobalContext.docItems = [
            {
                id: 'getting-started',
                path: 'button',
                channelPath: 'configuration',
                title: '快速开始',
                order: 30,
                contentPath: 'docs/guides/intro/getting-started.html',
            },
            ...originalDocItems,
        ];
        spectator.service.selectChannelByPath('components');
        const docItem = spectator.service.getDocItemByPath('button');
        expect(docItem).toEqual({
            id: 'button',
            title: 'Button',
            subtitle: '按钮',
            path: 'button',
            importSpecifier: 'alib/button',
            channelPath: 'components',
            examples: ['alib-button-basic-example', 'alib-button-advance-title-example', 'alib-button-advance-example'],
            overview: true,
            api: true,
            order: 1,
            category: 'general',
        });

        mockGlobalContext.docItems = originalDocItems;
    });

    it('should get doc item when same name in diff lib', () => {
        mockGlobalContext.docItems = [
            {
                id: 'button',
                title: 'Button',
                subtitle: '按钮',
                path: 'button',
                importSpecifier: 'b-lib/button',
                channelPath: 'b-components',
                examples: [],
                overview: true,
                api: true,
                order: 1,
                category: 'general',
            },
            ...mockGlobalContext.docItems,
        ];
        spectator.service.selectChannelByPath('components');
        const docItem = spectator.service.getDocItemByPath('button');

        expect(docItem).toEqual(
            jasmine.objectContaining({
                id: 'button',
                title: 'Button',
                subtitle: '按钮',
                path: 'button',
                importSpecifier: 'alib/button',
                channelPath: 'components',
            }),
        );

        spectator.service.selectChannelByPath('b-components');
        const bDocItem = spectator.service.getDocItemByPath('button');

        expect(bDocItem).toEqual(
            jasmine.objectContaining({
                id: 'button',
                title: 'Button',
                subtitle: '按钮',
                path: 'button',
                importSpecifier: 'b-lib/button',
                channelPath: 'b-components',
            }),
        );
    });
});
