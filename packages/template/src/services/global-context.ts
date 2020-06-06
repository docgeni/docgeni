import { Injectable, Inject, InjectionToken } from '@angular/core';
import { DocgeniSiteConfig, NavigationItem } from '../interfaces';
import { HttpClient } from '@angular/common/http';
export const CONFIG_TOKEN = new InjectionToken('DOC_SITE_CONFIG');

export const DEFAULT_CONFIG: DocgeniSiteConfig = {
    title: 'Docgeni',
    description: '为 Angular 组件开发场景而生的文档工具',
    navs: []
};

const DOCGENI_LOCALE = 'docgeni-locale';

@Injectable({
    providedIn: 'root'
})
export class GlobalContext {
    locale: string;

    navs: Record<string, NavigationItem[]>;

    get isDefaultLocale() {
        return this.locale === this.config.defaultLocale;
    }

    constructor(@Inject(CONFIG_TOKEN) public config: DocgeniSiteConfig, private http: HttpClient) {
        this.locale = config.defaultLocale;
        const locale = window.localStorage.getItem(DOCGENI_LOCALE);
        if (locale) {
            this.locale = locale;
        }
    }

    setLocale(locale: string) {
        this.locale = locale;
        window.localStorage.setItem(DOCGENI_LOCALE, locale);
    }

    initialize() {
        return new Promise((resolve, reject) => {
            this.http.get(`/assets/content/navigations.json`).subscribe({
                next: (response: Record<string, NavigationItem[]>) => {
                    this.navs = response;
                    resolve(response);
                },
                error: error => {
                    reject(error);
                }
            });
        });
    }
}

export function initializeDocgeniSite(globalContext: GlobalContext) {
    return (): Promise<any> => {
        return globalContext.initialize();
    };
}
