import { Injectable, Inject, InjectionToken } from '@angular/core';
import { DocgeniSiteConfig, NavigationItem, DocgeniMode } from '../interfaces/public-api';
import { HttpClient } from '@angular/common/http';
export const CONFIG_TOKEN = new InjectionToken('DOC_SITE_CONFIG');

export const DEFAULT_CONFIG: DocgeniSiteConfig = {
    title: 'Docgeni',
    description: '为 Angular 组件开发场景而生的文档工具'
};

const DOCGENI_LOCALE_KEY = 'docgeni-locale';
const DOCGENI_MODE_KEY = 'docgeni-mode';

@Injectable({
    providedIn: 'root'
})
export class GlobalContext {
    locale: string;

    navs: NavigationItem[];

    docItems: NavigationItem[];

    get isDefaultLocale() {
        return this.locale === this.config.defaultLocale;
    }

    constructor(@Inject(CONFIG_TOKEN) public config: DocgeniSiteConfig, private http: HttpClient) {
        this.locale = config.defaultLocale;
        const cacheLocale = window.localStorage.getItem(DOCGENI_LOCALE_KEY) || window.navigator.language || '';
        const cacheMode = window.localStorage.getItem(DOCGENI_MODE_KEY);
        if (cacheLocale) {
            const isSupport = config.locales.findIndex(item => {
                return item.key.toLocaleLowerCase() === cacheLocale.toLocaleLowerCase();
            });

            if (isSupport !== -1) {
                this.locale = config.locales[isSupport].key;
            }
        }
        if (cacheMode && ['lite', 'full'].includes(cacheMode)) {
            config.mode = cacheMode as DocgeniMode;
        }
        document.body.classList.add(`dg-mode-${this.config.mode}`, `dg-theme-${this.config.theme}`);
    }

    setLocale(locale: string) {
        this.locale = locale;
        window.localStorage.setItem(DOCGENI_LOCALE_KEY, locale);
    }

    getNowTimestamp() {
        return new Date().getTime();
    }

    initialize() {
        return new Promise((resolve, reject) => {
            this.http.get(`assets/content/navigations-${this.locale}.json?t=${this.getNowTimestamp()}`).subscribe({
                next: (response: { navs: NavigationItem[]; docs: NavigationItem[] }) => {
                    this.navs = response.navs;
                    this.docItems = response.docs;
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
}
