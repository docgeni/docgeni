import { Injectable, Inject } from '@angular/core';
import { NavigationItem, DocItem, ChannelItem, CategoryItem, DocgeniSiteConfig } from '../interfaces/public-api';
import { CONFIG_TOKEN, GlobalContext } from './global-context';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    channel$ = new BehaviorSubject<ChannelItem>(null);

    docItem$ = new BehaviorSubject<NavigationItem>(null);

    /** Responsive layout, sidebar default is hide */
    showSidebar = false;

    get channel() {
        return this.channel$.value;
    }

    get docItem() {
        return this.docItem$.value;
    }

    get navs() {
        return this.global.navs;
    }

    get docItems() {
        return this.global.docItems;
    }

    constructor(@Inject(CONFIG_TOKEN) public config: DocgeniSiteConfig, private global: GlobalContext) {}

    getChannels(): ChannelItem[] {
        return this.navs as ChannelItem[];
    }

    getChannel(path: string): ChannelItem {
        return this.navs.find(nav => {
            return nav.path === path;
        });
    }

    getDocItemByPath(path: string) {
        return this.docItems.find(docItem => {
            return docItem.path === path;
        });
    }

    selectChannelByPath(path: string) {
        const channel = this.navs.find(nav => {
            return nav.path === path;
        });
        this.channel$.next(channel);
        return channel;
    }

    getDocItemInChannel(path: string): DocItem {
        if (!this.channel || !this.channel.items) {
            return null;
        }
        return this.getDocItemByPath(path);
    }

    selectDocItem(path: string) {
        const docItem = this.getDocItemByPath(path);
        this.docItem$.next(docItem);
    }

    getChannelFirstDocItem() {
        let docItem: DocItem;
        if (this.channel && this.channel.items) {
            const category = this.channel.items[0];
            if (category && this.isCategoryItem(category)) {
                docItem = category.items[0];
            } else {
                docItem = category as DocItem;
            }
        }
        return docItem;
    }

    searchFirstDocItem() {
        let docItem: DocItem;
        for (const nav of this.navs) {
            if (this.isDocItem(nav)) {
                docItem = nav;
            } else {
                docItem = this.getNavFirstDocItem(nav as NavigationItem);
            }
            if (docItem) {
                break;
            }
        }
        return docItem;
    }

    getNavFirstDocItem(nav: NavigationItem) {
        let docItem: DocItem;
        for (const item of nav.items) {
            if (item && this.isCategoryItem(item)) {
                docItem = this.getNavFirstDocItem(item);
            } else {
                docItem = item as DocItem;
            }
            if (docItem) {
                break;
            }
        }
        return docItem;
    }

    toggleSidebar() {
        this.showSidebar = !this.showSidebar;
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
