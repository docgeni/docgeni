import { Locale, NavigationItem } from '../../interfaces';
import { getItemLocaleProperty } from '../../utils';

export class ConfigNavsPreparer {
    rootNavs: NavigationItem[] = [];
    configNavsByLocale: Record<string, NavigationItem[]> = {};
    docsNavInsertIndex = 0;

    constructor(private locales: Locale[]) {}

    prepare(rawNavs: Array<NavigationItem | null>): void {
        let navs = rawNavs;
        let docsNavInsertIndex = navs.indexOf(null);
        if (docsNavInsertIndex >= 0) {
            navs = rawNavs.filter((item) => {
                return !!item;
            }) as NavigationItem[];
        } else {
            docsNavInsertIndex = navs.length;
        }

        this.rootNavs = navs as NavigationItem[];
        this.docsNavInsertIndex = docsNavInsertIndex;
        this.configNavsByLocale = this.buildNavsMapForLocales(this.rootNavs);
    }

    private buildNavsMapForLocales(navs: NavigationItem[]): Record<string, NavigationItem[]> {
        const localeNavsMap: Record<string, NavigationItem[]> = {};
        this.locales.forEach((locale) => {
            localeNavsMap[locale.key] = this.buildNavsForLocale(locale, navs);
        });
        return localeNavsMap;
    }

    private buildNavsForLocale(locale: Locale, navs: NavigationItem[]): NavigationItem[] {
        return (navs || []).map((rawNav) => {
            const nav: NavigationItem = {
                ...rawNav,
                title: getItemLocaleProperty(rawNav, locale.key, 'title'),
                subtitle: getItemLocaleProperty(rawNav, locale.key, 'subtitle'),
            };
            if (rawNav.items) {
                nav.items = this.buildNavsForLocale(locale, rawNav.items);
            }
            delete nav.locales;
            return nav;
        });
    }
}
