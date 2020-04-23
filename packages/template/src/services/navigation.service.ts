import { Injectable, Inject } from '@angular/core';
import { NavigationItem, DocItem, ChannelItem, CategoryItem } from '../interfaces';
import { CONFIG_TOKEN, DocgeniSiteConfig } from './config';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    channel$ = new BehaviorSubject<ChannelItem>(null);

    docItem$ = new BehaviorSubject<DocItem>(null);

    get channel() {
        return this.channel$.value;
    }

    get docItem() {
        return this.docItem$.value;
    }

    constructor(@Inject(CONFIG_TOKEN) public config: DocgeniSiteConfig) {}

    getChannels(): ChannelItem[] {
        return this.config.navs as ChannelItem[];
    }

    getChannel(path: string): ChannelItem {
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

    getDocItem(path: string): DocItem {
        if (!this.channel || !this.channel.items) {
            return null;
        }
        let result: DocItem = null;
        for (const nav of this.channel.items) {
            if (this.isDocItem(nav)) {
                if (this.isPathEqual(nav.path, path)) {
                    result = nav;
                    break;
                }
            } else {
                const item = nav.items.find(subNav => {
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

    selectDocItem(path: string) {
        const docItem = this.getDocItem(path);
        this.docItem$.next(docItem);
    }

    getChannelFirstDocItem() {
        let docItem: DocItem;
        if (this.channel && this.channel.items) {
            const category = this.channel.items[0];
            if (category && this.isCategoryItem(category)) {
                docItem = category.items[0];
            }
        }
        return docItem;
    }

    private isPathEqual(path1: string, path2: string) {
        if (!path1 && !path2) {
            return true;
        } else {
            return path1 === path2;
        }
    }

    private isCategoryItem(category: CategoryItem | DocItem): category is CategoryItem {
        return category['items'];
    }

    private isDocItem(item: any): item is DocItem {
        return !item.items;
    }
}
