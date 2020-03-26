import { Injectable, Inject } from '@angular/core';
import { NavigationItem, DocItem } from './interfaces';
import { CONFIG_TOKEN, DocgConfig } from './config';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    channel$ = new BehaviorSubject<NavigationItem>(null);

    get channel() {
        return this.channel$.value;
    }

    constructor(@Inject(CONFIG_TOKEN) public config: DocgConfig) {}

    getPrimaryNavs(): NavigationItem[] {
        return this.config.navs;
    }

    getPrimaryNav(path: string) {
        return this.config.navs.find(nav => {
            return nav.path === path;
        });
    }

    selectChannelByPath(path: string) {
        const channel = this.config.navs.find(nav => {
            return nav.path === path;
        });
        this.channel$.next(channel);
    }

    getDocItem(path: string) {
        if (!this.channel || !this.channel.children) {
            return null;
        }
        let result = null;
        for (const nav of this.channel.children) {
            if (this.isDocItem(nav)) {
                if (this.isPathEqual(nav.path, path)) {
                    result = nav;
                    break;
                }
            } else {
                const item = nav.children.find(subNav => {
                    return this.isPathEqual(subNav.path, path);
                });
                if (item) {
                    result = item;
                    break;
                }
            }
        }
        return result;
    }

    private isPathEqual(path1: string, path2: string) {
        if (!path1 && !path2) {
            return true;
        } else {
            return path1 === path2;
        }
    }

    private isDocItem(item: any): item is DocItem {
        return !item.children;
    }
}
