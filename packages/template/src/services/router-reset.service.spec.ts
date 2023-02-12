import { Router, RouterModule, Routes } from '@angular/router';
import { createServiceFactory, Spectator, SpectatorService } from '@ngneat/spectator';
import { DocgeniSiteConfig, NavigationItem } from '../interfaces';
import { CONFIG_TOKEN, GlobalContext } from './global-context';
import { RouterResetService } from './router-reset.service';

describe('router-reset.service', () => {
    let spectator: SpectatorService<RouterResetService>;
    let mockGlobal: { config: Partial<DocgeniSiteConfig>; navs: NavigationItem[]; docItems: NavigationItem[] };

    const createService = createServiceFactory({
        service: RouterResetService,
        providers: [
            {
                provide: GlobalContext,
                useFactory: function() {
                    return mockGlobal;
                }
            }
        ],
        imports: [RouterModule.forRoot([], { relativeLinkResolution: 'legacy' })],
        entryComponents: [],
        mocks: []
    });

    beforeEach(() => {
        mockGlobal = {
            config: {
                defaultLocale: 'zh-cn',
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
                mode: 'full'
            },
            navs: [
                {
                    id: '/guides',
                    path: 'guides',
                    title: 'Guide',
                    items: [
                        {
                            id: '/guides/getting-started',
                            path: 'getting-started',
                            title: 'Getting Started',
                            items: []
                        }
                    ]
                }
            ],
            docItems: []
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
        assertRoutes(spectator.inject(Router).config[0].children!, ['guides']);
    });

    function assertRoutes(routes: Routes, paths: string[]) {
        paths.forEach(path => {
            const route = routes.find(route => {
                return route.path === path;
            });
            expect(route).toBeTruthy(`${path} route is not found`);
        });
    }
});
