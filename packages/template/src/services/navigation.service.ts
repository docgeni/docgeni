import { Injectable, Inject } from '@angular/core';
import { NavigationItem, DocItem, ChannelItem } from './interfaces';
import { CONFIG_TOKEN, DocgeniConfig } from './config';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    channel$ = new BehaviorSubject<NavigationItem>(null);

    docItem$ = new BehaviorSubject<DocItem>(null);

    get channel() {
        return this.channel$.value;
    }

    get docItem() {
        return this.docItem$.value;
    }

    constructor(@Inject(CONFIG_TOKEN) public config: DocgeniConfig) {}

    getChannels(): ChannelItem[] {
        return this.config.navs;
    }

    getChannel(path: string) {
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
        if (!this.channel || !this.channel.children) {
            return null;
        }
        let result: NavigationItem = null;
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
        return result as DocItem;
    }

    selectDocItem(path: string) {
        const docItem = this.getDocItem(path);
        this.docItem$.next(docItem);
    }

    getChannelFirstDocItem() {
        let docItem: DocItem;
        if (this.channel && this.channel.children) {
            docItem = this.channel.children[0];
            if (docItem['children']) {
                docItem = docItem['children'][0];
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

    private isDocItem(item: any): item is DocItem {
        return !item.children;
    }
}
