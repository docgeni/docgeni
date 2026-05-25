import { computed, Injectable, signal } from '@angular/core';
import { NavigationItem, DocItem, ChannelItem, CategoryItem } from '../interfaces/public-api';
import { GlobalContext } from './global-context';

@Injectable({
    providedIn: 'root',
})
export class NavigationService {
    readonly channel = signal<ChannelItem | null>(null);

    readonly docItem = signal<NavigationItem | null>(null);

    readonly docPages = signal<{ pre: NavigationItem; next: NavigationItem } | null>(null);

    /** Responsive layout, sidebar default is hide */
    readonly showSidebar = signal(false);

    readonly navs = computed(() => this.global.navs ?? []);

    readonly docItems = computed(() => this.global.docItems ?? []);

    readonly channels = computed(() => this.buildChannels(this.navs()));

    constructor(private global: GlobalContext) {}

    getChannel(path: string): ChannelItem {
        return this.channels().find((nav) => nav.path === path) as ChannelItem;
    }

    getDocItemByPath(path: string) {
        const docItems = this.docItems();
        const channel = this.channel();
        let index: number;
        if (channel) {
            // 类库频道
            if (channel.lib) {
                index = docItems.findIndex((docItem) => {
                    return docItem.path === path && docItem.channelPath === channel.path && !!docItem.importSpecifier;
                });
            } else {
                index = docItems.findIndex((docItem) => {
                    return docItem.path === path && docItem.channelPath === channel.path;
                });
            }
        } else {
            index = docItems.findIndex((docItem) => {
                return docItem.path === path && (this.global.config.mode === 'lite' ? true : !docItem.channelPath);
            });
        }
        if (index > -1) {
            const preDocItem = index ? docItems[index - 1] : undefined;
            const nextDocItem = docItems.length - 1 === index ? undefined : docItems[index + 1];
            this.docPages.set({
                pre: preDocItem!,
                next: nextDocItem!,
            });
        }
        return docItems[index];
    }

    selectChannelByPath(path: string) {
        const channel = this.getChannel(path);
        this.channel.set(channel);
        return channel;
    }

    clearChannel() {
        this.channel.set(null);
    }

    selectDocItem(path: string) {
        const docItem = this.getDocItemByPath(path);
        this.docItem.set(docItem);
    }

    getChannelFirstDocItem() {
        const channel = this.channel();
        if (channel && channel.items) {
            return this.searchFirstDocItem(channel.items as NavigationItem[]);
        }
        return null;
    }

    searchFirstDocItem(items: NavigationItem[] = this.channels() as NavigationItem[]) {
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
        this.showSidebar.update((open) => !open);
    }

    resetShowSidebar() {
        this.showSidebar.set(false);
    }

    private buildChannels(navs: NavigationItem[]): ChannelItem[] {
        const channels: ChannelItem[] = [];
        for (const nav of navs) {
            const channel = nav as ChannelItem;
            if (!channel.path && channel.items?.length) {
                channels.push(...(channel.items as ChannelItem[]));
            } else {
                channels.push(channel);
            }
        }
        return channels;
    }

    private isCategoryItem(category: CategoryItem | DocItem): category is CategoryItem {
        return (category as any).items;
    }

    private isDocItem(item: any): item is DocItem {
        return !item.items;
    }
}
