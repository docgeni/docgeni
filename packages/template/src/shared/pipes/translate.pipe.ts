import { GlobalContext } from './../../services/global-context';
import { NavigationItem } from './../../interfaces/navigation-item';
import { Pipe, PipeTransform } from '@angular/core';

const TRANSLATES: Record<string, Record<string, string>> = {
    'zh-cn': {
        OVERVIEW: '概览',
        EXAMPLES: '示例',
        HOME: '首页',
        LAST_UPDATED_TIME: '最后更新',
        PRE_PAGE: '上一篇',
        NEXT_PAGE: '下一篇',
        SEARCH: '搜索'
    },
    'en-us': {
        OVERVIEW: 'Overview',
        EXAMPLES: 'Examples',
        HOME: 'Home',
        LAST_UPDATED_TIME: 'Last updated',
        PRE_PAGE: 'Previous',
        NEXT_PAGE: 'Next',
        SEARCH: 'Search'
    }
};
@Pipe({ name: 'dgTranslate' })
export class TranslatePipe implements PipeTransform {
    constructor(private global: GlobalContext) {}

    transform(key: string): string {
        const langTranslates: Record<string, string> = TRANSLATES[this.global.locale.toLowerCase()] || TRANSLATES['en-us'];
        return langTranslates[key] ? langTranslates[key] : key;
    }
}
