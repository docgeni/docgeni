import { GlobalContext } from './../../services/global-context';
import { Pipe, PipeTransform, inject } from '@angular/core';

const TRANSLATES: Record<string, Record<string, string>> = {
    'zh-cn': {
        OVERVIEW: '概览',
        EXAMPLES: '示例',
        HOME: '首页',
        LAST_UPDATED_TIME: '最后更新',
        PRE_PAGE: '上一篇',
        NEXT_PAGE: '下一篇',
        SEARCH: '搜索',
    },
    'en-us': {
        OVERVIEW: 'Overview',
        EXAMPLES: 'Examples',
        HOME: 'Home',
        LAST_UPDATED_TIME: 'Last updated',
        PRE_PAGE: 'Previous',
        NEXT_PAGE: 'Next',
        SEARCH: 'Search',
    },
};

export function translateByLocale(key: string, locale: string): string {
    const langTranslates: Record<string, string> = TRANSLATES[locale.toLowerCase()] || TRANSLATES['en-us'];
    return langTranslates[key] ?? key;
}

@Pipe({ name: 'dgTranslate' })
export class TranslatePipe implements PipeTransform {
    private global = inject(GlobalContext);

    transform(key: string): string {
        return translateByLocale(key, this.global.locale);
    }
}
