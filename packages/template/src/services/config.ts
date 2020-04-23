import { Injectable, Inject, InjectionToken } from '@angular/core';
import { DocgeniSiteConfig } from '../interfaces';
export const CONFIG_TOKEN = new InjectionToken('DOC_SITE_CONFIG');

export { DocgeniSiteConfig };

export const DEFAULT_CONFIG: DocgeniSiteConfig = {
    title: 'Docgeni',
    description: '为 Angular 组件开发场景而生的文档工具',
    navs: []
};

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    constructor(@Inject(CONFIG_TOKEN) public value: DocgeniSiteConfig) {}
}
