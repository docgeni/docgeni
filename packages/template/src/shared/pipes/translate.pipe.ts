import { GlobalContext } from './../../services/global-context';
import { NavigationItem } from './../../interfaces/navigation-item';
import { Pipe, PipeTransform } from '@angular/core';

const TRANSLATES = {
    'zh-cn': {
        OVERVIEW: '概览',
        EXAMPLES: '示例',
        HOME: '首页'
    },
    'en-us': {
        OVERVIEW: 'Overview',
        EXAMPLES: 'Examples',
        HOME: 'Home'
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
