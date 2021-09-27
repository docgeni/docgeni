import { DocgeniSiteConfig } from './../interfaces/config';
import { CONFIG_TOKEN, GlobalContext } from './global-context';
import { createServiceFactory, createHttpFactory, SpectatorHttp, HttpMethod } from '@ngneat/spectator';
import { NavigationItem } from '../interfaces';

describe('GlobalContext', () => {
    let spectator: SpectatorHttp<GlobalContext>;
    const createService = createHttpFactory({
        service: GlobalContext,
        providers: [
            {
                provide: CONFIG_TOKEN,
                useValue: {
                    defaultLocale: 'zh-cn'
                }
            }
        ],
        entryComponents: [],
        mocks: []
    });

    beforeEach(() => {
        spectator = createService();
    });

    it('should create success', () => {
        expect(spectator.service).toBeTruthy();
    });

    describe('local', () => {
        it(`should set locale from defaultLocale in site config`, () => {
            const globalContext = new GlobalContext(
                {
                    defaultLocale: 'zh-cn'
                } as DocgeniSiteConfig,
                undefined
            );
            expect(globalContext.locale).toBe('zh-cn');
        });

        it(`should set locale from cache`, () => {
            window.localStorage.setItem('docgeni-locale', 'en-us');
            const globalContext = new GlobalContext(
                {
                    defaultLocale: 'zh-cn',
                    locales: [
                        { key: 'zh-cn', name: '中文' },
                        { key: 'en-us', name: '英文' }
                    ]
                } as DocgeniSiteConfig,
                undefined
            );
            expect(globalContext.locale).toBe('en-us');
            window.localStorage.setItem('docgeni-locale', '');
        });

        it(`should use default locale when cache locale is not in locales`, () => {
            window.localStorage.setItem('docgeni-locale', 'en-us');
            const globalContext = new GlobalContext(
                {
                    defaultLocale: 'zh-cn',
                    locales: [{ key: 'zh-cn', name: '中文' }]
                } as DocgeniSiteConfig,
                undefined
            );
            expect(globalContext.locale).toBe('zh-cn');
            window.localStorage.setItem('docgeni-locale', '');
        });
        it(`should use browser locale`, () => {
            const browserLanguage = window.navigator.language;
            const globalContext = new GlobalContext(
                {
                    defaultLocale: '',
                    locales: [{ key: browserLanguage, name: '' }]
                } as DocgeniSiteConfig,
                undefined
            );
            expect(globalContext.locale).toBe(browserLanguage);
            window.localStorage.setItem('docgeni-locale', '');
        });
    });

    describe('mode', () => {
        it(`should set mode from site config`, () => {
            const globalContext = new GlobalContext(
                {
                    defaultLocale: 'zh-cn',
                    mode: 'full'
                } as DocgeniSiteConfig,
                undefined
            );
            expect(globalContext.config.mode).toBe('full');
            expect(document.documentElement.classList.contains(`dg-mode-full`));
        });

        it(`should set mode from cache`, () => {
            window.localStorage.setItem('docgeni-mode', 'lite');
            const globalContext = new GlobalContext(
                {
                    defaultLocale: 'zh-cn',
                    mode: 'full'
                } as DocgeniSiteConfig,
                undefined
            );
            expect(globalContext.config.mode).toBe('lite');
            expect(document.documentElement.classList.contains(`dg-mode-lite`));
            window.localStorage.clear();
        });
    });

    it('should get now timestamp success', () => {
        const beforeTimestamp = new Date().getTime();
        const expectedTimestamp = spectator.service.getNowTimestamp();
        const afterTimestamp = new Date().getTime();
        expect(expectedTimestamp >= beforeTimestamp).toBeTruthy();
        expect(expectedTimestamp <= afterTimestamp).toBeTruthy();
    });

    it('should get navigations success', () => {
        const mockNowTimestamp = new Date().getTime();
        const getNowTimestampSyp = spyOn(spectator.service, 'getNowTimestamp');
        getNowTimestampSyp.and.returnValue(mockNowTimestamp);
        spectator.service.initialize().then(result => {});
        const req = spectator.expectOne(`assets/content/navigations-zh-cn.json?t=${mockNowTimestamp}`, HttpMethod.GET);

        const data = {
            navs: [
                {
                    id: 'guide',
                    path: 'guide',
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
                                    contentPath: 'docs/guides/intro/index.html'
                                }
                            ]
                        }
                    ]
                }
            ],
            docs: [
                {
                    id: 'index',
                    path: 'intro',
                    channelPath: 'guides',
                    title: '介绍',
                    order: 10,
                    contentPath: 'docs/guides/intro/index.html'
                }
            ]
        };
        req.flush(data);
        spectator.service.docItems.forEach(docItem => {
            delete docItem.docItemPath;
        });
        expect(spectator.service.navs).toEqual(data.navs);
        expect(spectator.service.docItems).toEqual(data.docs);
    });

    it('should flatNavs by correct sort', () => {
        const list: NavigationItem[] = [
            {
                id: '',
                title: '',
                path: '',
                items: [{ id: '', title: '', path: '', items: [{ id: '1', title: '', path: '' }] }]
            },
            { id: '2', title: '', path: '' },
            {
                id: '',
                title: '',
                path: '',
                items: [{ id: '3', title: '', path: '' }]
            },
            { id: '', title: '', path: '', items: [{ id: '4', title: '', path: '', hidden: true }] }
        ];
        const globalContext = new GlobalContext({} as DocgeniSiteConfig, undefined);
        const result = globalContext.flatNavs(list);
        expect(result.length).toBe(3);
        expect(result.map(item => item.id)).toEqual(['1', '2', '3']);
    });
});
