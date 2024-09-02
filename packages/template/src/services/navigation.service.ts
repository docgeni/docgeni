import { Injectable } from '@angular/core';
import { NavigationItem, DocItem, ChannelItem, CategoryItem } from '../interfaces/public-api';
import { GlobalContext } from './global-context';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    channel$ = new BehaviorSubject<ChannelItem | null>(null);

    docItem$ = new BehaviorSubject<NavigationItem | null>(null);
    docPages$ = new BehaviorSubject<{ pre: NavigationItem; next: NavigationItem } | null>(null);
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
        }) as ChannelItem;
    }

    getDocItemByPath(path: string) {
        let index: number;
        if (this.channel) {
            // 类库频道
            if (this.channel.lib) {
                index = this.docItems.findIndex(docItem => {
                    return docItem.path === path && docItem.channelPath === this.channel!.path && !!docItem.importSpecifier;
                });
            } else {
                index = this.docItems.findIndex(docItem => {
                    return docItem.path === path && docItem.channelPath === this.channel!.path;
                });
            }
        } else {
            index = this.docItems.findIndex(docItem => {
                return docItem.path === path && (this.global.config.mode === 'lite' ? true : !docItem.channelPath);
            });
        }
        if (index > -1) {
            const preDocItem = index ? this.docItems[index - 1] : undefined;
            const nextDocItem = this.docItems.length - 1 === index ? undefined : this.docItems[index + 1];
            this.docPages$.next({
                pre: preDocItem!,
                next: nextDocItem!
            });
        }
        return this.docItems[index];
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
        if (this.channel && this.channel.items) {
            return this.searchFirstDocItem(this.channel.items as NavigationItem[]);
        }
        return null;
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
        return docItem!;
    }

    getNavFirstDocItem(nav: NavigationItem) {
        let docItem: DocItem;
        for (const item of nav.items!) {
            if (item && this.isCategoryItem(item)) {
                docItem = this.getNavFirstDocItem(item as NavigationItem);
            } else {
                docItem = item as DocItem;
            }
            if (docItem) {
                break;
            }
        }
        return docItem!;
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
