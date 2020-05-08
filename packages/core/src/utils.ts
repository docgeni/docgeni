import { NavigationItem, Locale } from './interfaces';

type ExtractLocaleItem<T> = T extends {
    locales?: {
        [key: string]: infer TPart;
    };
}
    ? TPart
    : never;

export function getItemLocaleProperty<
    T extends { locales?: { [key: string]: ExtractLocaleItem<T> } },
    TProperty extends keyof ExtractLocaleItem<T>
>(item: T, locale: string, property: TProperty): ExtractLocaleItem<T>[TProperty] {
    if (item.locales && item.locales[locale] && item.locales[locale][property]) {
        return item.locales[locale][property];
    } else {
        return (item as any)[property];
    }
}

export function buildLocaleNavs(locale: Locale, navs: NavigationItem[]): NavigationItem[] {
    return (navs || []).map(rawNav => {
        const nav: NavigationItem = {
            ...rawNav,
            title: getItemLocaleProperty(rawNav, locale.key, 'title'),
            subtitle: getItemLocaleProperty(rawNav, locale.key, 'subtitle')
        };
        if (rawNav.items) {
            nav.items = buildLocaleNavs(locale, rawNav.items);
        }
        delete nav.locales;
        return nav;
    });
}

export function buildLocalesNavsMap(locales: Locale[], navs: NavigationItem[]): Record<string, NavigationItem[]> {
    const localeNavsMap: Record<string, NavigationItem[]> = {};
    locales.forEach(locale => {
        localeNavsMap[locale.key] = [];
    });

    (navs || []).forEach(rawNav => {
        locales.forEach(locale => {
            const nav: NavigationItem = {
                ...rawNav,
                title: getItemLocaleProperty(rawNav, locale.key, 'title'),
                subtitle: getItemLocaleProperty(rawNav, locale.key, 'subtitle')
            };
            if (rawNav.items) {
                nav.items = buildLocaleNavs(locale, rawNav.items);
            }
            delete nav.locales;

            localeNavsMap[locale.key].push(nav);
        });
    });
    return localeNavsMap;
}
