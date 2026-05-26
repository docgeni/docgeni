import { Router, RouterModule, Routes } from '@angular/router';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { DocgeniSiteConfig, NavigationItem } from '../interfaces';
import { GlobalContext } from './global-context';
import { NavigationService } from './navigation.service';
import { RouterResetService } from './router-reset.service';

describe('router-reset.service', () => {
    let spectator: SpectatorService<RouterResetService>;
    let mockGlobal: { config: Partial<DocgeniSiteConfig>; navs: NavigationItem[]; docItems: NavigationItem[] };

    const createService = createServiceFactory({
        service: RouterResetService,
        providers: [
            NavigationService,
            {
                provide: GlobalContext,
                useFactory: function () {
                    return mockGlobal;
                },
            },
        ],
        imports: [RouterModule.forRoot([], {})],
        mocks: [],
    });

    beforeEach(() => {
        mockGlobal = {
            config: {
                defaultLocale: 'zh-cn',
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
                mode: 'full',
            },
            navs: [
                {
                    id: '/guides',
                    path: 'guides',
                    title: 'Guide',
                    items: [
                        {
                            id: '/guides/getting-started',
                            path: 'guides/getting-started',
                            title: 'Getting Started',
                        },
                    ],
                },
            ],
            docItems: [
                {
                    id: '/guides/getting-started',
                    path: 'guides/getting-started',
                    channelPath: 'guides',
                    title: 'Getting Started',
                },
            ],
        };
    });

    it('should create success', () => {
        spectator = createService();
        expect(spectator.service).toBeTruthy();
        expect(spectator.inject(Router).config).toEqual([]);
    });

    it('should reset route config success for full mode', () => {
        spectator = createService();
        spectator.service.resetRoutes();
        assertRoutes(spectator.inject(Router).config, ['zh-cn', 'en-us', '', '~examples/:name', '**']);
        assertRoutes(spectator.inject(Router).config[0].children!, ['', 'guides', 'guides/getting-started']);
    });

    it('should register lib channel with :id route and skip component doc routes', () => {
        mockGlobal.navs = [
            {
                id: 'components',
                path: 'components',
                title: 'Components',
                lib: 'alib',
                items: [
                    {
                        id: 'button',
                        path: 'components/button',
                        title: 'Button',
                    },
                ],
            },
        ];
        mockGlobal.docItems = [
            {
                id: 'button',
                path: 'components/button',
                channelPath: 'components',
                title: 'Button',
                importSpecifier: 'alib/button',
            },
        ];
        spectator = createService();
        spectator.service.resetRoutes();
        const routes = spectator.inject(Router).config[0].children!;
        expect(routes.find((route) => route.path === 'button')).toBeFalsy();
        const libRoute = routes.find((route) => route.path === 'components/:id');
        expect(libRoute).toBeTruthy();
        expect(libRoute!.children!.map((route) => route.path)).toEqual(['', 'overview', 'api', 'examples', 'empty', '**']);
        const channelRoute = routes.find((route) => route.path === 'components');
        expect(channelRoute!.redirectTo).toEqual('components/button');
    });

    function assertRoutes(routes: Routes, paths: string[]) {
        paths.forEach((path) => {
            const route = routes.find((route) => {
                return route.path === path;
            });
            expect(route).toBeTruthy(`${path} route is not found`);
        });
    }
});
