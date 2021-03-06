import { Injectable, Inject } from '@angular/core';
import { NavigationItem, DocItem, ChannelItem, CategoryItem, DocgeniSiteConfig } from '../interfaces/public-api';
import { GlobalContext } from './global-context';
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

    constructor(private global: GlobalContext) {}

    getChannels(): ChannelItem[] {
        return this.navs as ChannelItem[];
    }

    getChannel(path: string): ChannelItem {
        return this.navs.find(nav => {
            return nav.path === path;
        });
    }

    getDocItemByPath(path: string) {
        if (this.channel) {
            // 类库频道
            if (this.channel.lib) {
                return this.docItems.find(docItem => {
                    return docItem.path === path && !!docItem.importSpecifier;
                });
            } else {
                return this.docItems.find(docItem => {
                    return docItem.path === path && docItem.channelPath === this.channel.path;
                });
            }
        } else {
            return this.docItems.find(docItem => {
                return docItem.path === path;
            });
        }
    }

    selectChannelByPath(path: string) {
        const channel = this.getChannel(path);
        this.channel$.next(channel);
        return channel;
    }

    clearChannel() {
        this.channel$.next(null);
    }

    selectDocItem(path: string) {
        const docItem = this.getDocItemByPath(path);
        this.docItem$.next(docItem);
    }

    getChannelFirstDocItem() {
        let docItem: DocItem;
        if (this.channel && this.channel.items) {
            return this.searchFirstDocItem(this.channel.items as NavigationItem[]);
        }
        return docItem;
    }

    searchFirstDocItem(items: NavigationItem[] = this.navs) {
        let docItem: DocItem;
        for (const nav of items) {
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

    resetShowSidebar() {
        this.showSidebar = false;
    }

    private isCategoryItem(category: CategoryItem | DocItem): category is CategoryItem {
        return (category as any).items;
    }

    private isDocItem(item: any): item is DocItem {
        return !item.items;
    }
}
