import { Injectable, Inject, InjectionToken } from '@angular/core';
import { NavigationItem } from './interfaces';

export const CONFIG_TOKEN = new InjectionToken('DOC_SITE_CONFIG');

export interface DocgConfig {
    title: string;
    description: string;
    repoUrl?: string;
    navs: NavigationItem[];
}

export const DEFAULT_CONFIG: DocgConfig = {
    title: 'Doc Gen',
    description: '为 Angular 组件开发场景而生的文档工具',
    navs: []
};

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    constructor(@Inject(CONFIG_TOKEN) public value: DocgConfig) {}
}
