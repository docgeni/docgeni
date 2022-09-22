import { Injectable, Inject, InjectionToken } from '@angular/core';
import { DocgeniSiteConfig, NavigationItem, DocgeniMode, HomeDocMeta } from '../interfaces/public-api';
import { HttpClient } from '@angular/common/http';
import { languageCompare } from '../utils/language-compare';
import { DOCUMENT, Location } from '@angular/common';
export const CONFIG_TOKEN = new InjectionToken('DOC_SITE_CONFIG');

export const DEFAULT_CONFIG: DocgeniSiteConfig = {
    title: 'Docgeni',
    description: ''
};

const DOCGENI_LOCALE_KEY = 'docgeni-locale';
const DOCGENI_MODE_KEY = 'docgeni-mode';

@Injectable({
    providedIn: 'root'
})
export class GlobalContext {
    locale!: string;

    navs!: NavigationItem[];

    docItems!: NavigationItem[];

    homeMeta!: HomeDocMeta;

    owner!: string;

    repo!: string;

    get isDefaultLocale() {
        return this.locale === this.config.defaultLocale;
    }

    constructor(
        @Inject(CONFIG_TOKEN) public config: DocgeniSiteConfig,
        private http: HttpClient,
        @Inject(DOCUMENT) private document: any,
        private location: Location
    ) {
        this.setup();
    }

    private getLocaleKey(): string {
        const localeKeyFromUrl = this.getLocalKeyFromUrl();
        if (localeKeyFromUrl) {
            return localeKeyFromUrl;
        } else {
            const cacheLocale = window.localStorage.getItem(DOCGENI_LOCALE_KEY) || window.navigator.language || '';
            const locale = (this.config.locales || []).find(locale => {
                return languageCompare(locale.key, cacheLocale);
            });
            if (locale) {
                return locale.key;
            } else {
                return this.config.defaultLocale as string;
            }
        }
    }

    private setup() {
        this.setLocale(this.getLocaleKey());

        const cacheMode = window.localStorage.getItem(DOCGENI_MODE_KEY);
        if (cacheMode && ['lite', 'full'].includes(cacheMode)) {
            this.config.mode = cacheMode as DocgeniMode;
        }

        document.body.classList.add(`dg-mode-${this.config.mode}`, `dg-theme-${this.config.theme}`);
        if (this.config.repoUrl) {
            const pattern = /https:\/\/github.com\/([^\/]*)\/([^\/]*)/.exec(this.config.repoUrl);
            if (pattern && pattern.length === 3) {
                this.owner = pattern[1];
                this.repo = pattern[2];
            }
        }
    }

    public getLocalKeyFromUrl() {
        const localeFromUrl = (this.config.locales || []).find(locale => {
            return this.location.path().startsWith(`/${locale.key}`);
        });
        return localeFromUrl && localeFromUrl.key;
    }

    public setLocale(locale: string) {
        this.locale = locale;
        window.localStorage.setItem(DOCGENI_LOCALE_KEY, locale);
    }

    getNowTimestamp() {
        return new Date().getTime();
    }

    initialize() {
        return new Promise((resolve, reject) => {
            this.http
                .get<{ navs: NavigationItem[]; docs: NavigationItem[]; homeMeta: HomeDocMeta }>(
                    `assets/content/navigations-${this.locale}.json?t=${this.getNowTimestamp()}`
                )
                .subscribe({
                    next: (response: { navs: NavigationItem[]; docs: NavigationItem[]; homeMeta: HomeDocMeta }) => {
                        this.homeMeta = response.homeMeta;
                        this.navs = response.navs;
                        this.docItems = this.sortDocItems(this.navs);
                        resolve(response);
                    },
                    error: error => {
                        reject(error);
                    }
                });
        });
    }

    getAssetsContentPath(path: string) {
        return path.startsWith('/') ? `assets/content${path}` : `assets/content/${path}`;
    }

    sortDocItems(navs: NavigationItem[]) {
        navs = navs.slice();
        const list: NavigationItem[] = [];
        while (navs.length) {
            const item = navs.shift();
            if (item) {
                if (item.items) {
                    item.items.forEach(child => {
                        child.ancestors = child.ancestors || [];
                        child.ancestors.push(...(item.ancestors || []), item);
                    });
                    navs.unshift(...item.items);
                } else if (!item.hidden) {
                    list.push(item);
                }
            }
        }
        return list;
    }
}
