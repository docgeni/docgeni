import { DocgeniSiteConfig } from './../interfaces/config';
import { CONFIG_TOKEN, GlobalContext } from './global-context';
import { createServiceFactory, createHttpFactory, SpectatorHttp, HttpMethod } from '@ngneat/spectator';
import { DocItem, NavigationItem } from '../interfaces';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';

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
        mocks: []
    });

    function createGlobalContext(config: Partial<DocgeniSiteConfig>) {
        const globalContext = new GlobalContext(
            config as DocgeniSiteConfig,
            TestBed.inject(HttpClient),
            document,
            TestBed.inject(Location)
        );
        return globalContext;
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
    });

    afterEach(() => {
        window.localStorage.setItem('docgeni-locale', '');
    });

    it('should create success', () => {
        spectator = createService();
        expect(spectator.service).toBeTruthy();
    });

    describe('locale', () => {
        beforeEach(() => {
            window.localStorage.setItem('docgeni-locale', '');
        });

        afterEach(() => {
            window.localStorage.setItem('docgeni-locale', '');
        });

        it(`should set locale from defaultLocale in site config`, () => {
            const globalContext = createGlobalContext({
                defaultLocale: 'zh-cn'
            });
            expect(globalContext.locale).toBe('zh-cn');
        });

        it(`should set locale from cache`, () => {
            window.localStorage.setItem('docgeni-locale', 'en-us');
            const globalContext = createGlobalContext({
                defaultLocale: 'zh-cn',
                locales: [
                    { key: 'zh-cn', name: '中文' },
                    { key: 'en-us', name: '英文' }
                ]
            } as DocgeniSiteConfig);
            expect(globalContext.locale).toBe('en-us');
        });

        it(`should use default locale when cache locale is not in locales`, () => {
            window.localStorage.setItem('docgeni-locale', 'en-us');
            const globalContext = createGlobalContext({
                defaultLocale: 'zh-cn',
                locales: [{ key: 'zh-cn', name: '中文' }]
            } as DocgeniSiteConfig);
            expect(globalContext.locale).toBe('zh-cn');
        });

        it(`should use browser locale`, () => {
            const browserLanguage = window.navigator.language;
            const globalContext = createGlobalContext({
                defaultLocale: '',
                locales: [{ key: browserLanguage, name: browserLanguage }]
            } as DocgeniSiteConfig);
            expect(globalContext.locale).toBe(browserLanguage);
        });

        it(`should use url locale`, () => {
            TestBed.inject(Location).go('/en-us/hello');
            const globalContext = createGlobalContext({
                defaultLocale: 'zh-cn',
                locales: [
                    { key: 'zh-cn', name: '中文' },
                    { key: 'en-us', name: 'EN' }
                ]
            } as DocgeniSiteConfig);
            expect(globalContext.locale).toBe('en-us');
        });
    });

    describe('mode', () => {
        it(`should set mode from site config`, () => {
            const globalContext = createGlobalContext({
                defaultLocale: 'zh-cn',
                mode: 'full'
            } as DocgeniSiteConfig);
            expect(globalContext.config.mode).toBe('full');
            expect(document.documentElement.classList.contains(`dg-mode-full`));
        });

        it(`should set mode from cache`, () => {
            window.localStorage.setItem('docgeni-mode', 'lite');
            const globalContext = createGlobalContext({
                defaultLocale: 'zh-cn',
                mode: 'full'
            } as DocgeniSiteConfig);
            expect(globalContext.config.mode).toBe('lite');
            expect(document.documentElement.classList.contains(`dg-mode-lite`));
            window.localStorage.clear();
        });
    });

    it('should get now timestamp success', () => {
        spectator = createService();
        const beforeTimestamp = new Date().getTime();
        const expectedTimestamp = spectator.service.getNowTimestamp();
        const afterTimestamp = new Date().getTime();
        expect(expectedTimestamp >= beforeTimestamp).toBeTruthy();
        expect(expectedTimestamp <= afterTimestamp).toBeTruthy();
    });

    it('should get navigations success', () => {
        spectator = createService();
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
            delete docItem.ancestors;
        });
        expect(spectator.service.navs).toEqual(data.navs);
        expect(spectator.service.docItems).toEqual(data.docs);
    });

    it('should sort doc items success', () => {
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
        ] as NavigationItem[];
        const globalContext = createGlobalContext({} as DocgeniSiteConfig);
        const result = globalContext.sortDocItems(list);
        expect(result.length).toBe(3);
        expect(result.map(item => item.id)).toEqual(['1', '2', '3']);
    });
});
