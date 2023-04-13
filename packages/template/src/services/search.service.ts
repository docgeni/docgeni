import { Inject, Injectable } from '@angular/core';
import { GlobalContext } from './global-context';
import { DOCUMENT } from '@angular/common';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

export interface SearchPageInfo {
    title: string;
    id: string;
    path: string;
    parent?: SearchPageInfo;
}

@Injectable({ providedIn: 'root' })
export class SearchService {
    private allPages: SearchPageInfo[] = [];

    private destroyed$ = new Subject();

    public result: SearchPageInfo[] = [];

    public get hasAlgolia() {
        return !!(this.global.config.algolia && this.global.config.algolia.apiKey && this.global.config.algolia.indexName);
    }

    constructor(public global: GlobalContext, @Inject(DOCUMENT) private document: any) {}

    public initSearch(searchSelector: string) {
        if (this.hasAlgolia) {
            this.initAlgolia(searchSelector);
        } else {
            this.initInnerSearch(searchSelector);
        }
    }

    private async initAlgolia(searchSelector: string) {
        const algoliaConfig = this.global.config.algolia;
        const algolia = algoliaConfig?.appId
            ? {
                  appId: algoliaConfig.appId,
                  apiKey: algoliaConfig.apiKey,
                  indexName: algoliaConfig.indexName
              }
            : {
                  apiKey: algoliaConfig?.apiKey,
                  indexName: algoliaConfig?.indexName
              };

        (window as any).global = window;

        (window as any).process = {
            env: { DEBUG: undefined }
        };

        // @ts-ignore
        const { default: docsearch } = await import('docsearch.js');

        docsearch({
            ...algolia,
            inputSelector: searchSelector,
            algoliaOptions: {
                hitsPerPage: 5,
                facetFilters: [`lang: ${this.global.locale}`]
            },
            transformData: (hits: any) => {
                if (location.href.indexOf(this.global.locale) < 0) {
                    hits.forEach((hit: any) => {
                        hit.url = hit.url.replace(`${this.global.locale}/`, '');
                    });
                }
                return hits;
            }
            // debug: true
        });
    }

    private initInnerSearch(searchSelector: string) {
        this.generatePages();
        const searchContainer = this.document.querySelector(searchSelector);
        if (searchContainer) {
            fromEvent(searchContainer, 'input')
                .pipe(
                    debounceTime(100),
                    map(() => {
                        return searchContainer.value;
                    }),
                    distinctUntilChanged(),
                    takeUntil(this.destroyed$)
                )
                .subscribe(value => {
                    this.result = this.searchPages(value);
                });
        } else {
            throw new Error('not find search container');
        }
    }

    private generatePages() {
        this.allPages = [];
        this.global.docItems.forEach(docItem => {
            const path =
                this.global.config.mode === 'full' && docItem.channelPath ? `${docItem.channelPath}/${docItem.path}` : docItem.path;
            const parentPage = {
                title: `${docItem.title} ${docItem.subtitle ? docItem.subtitle : ''}`,
                id: docItem.id,
                path
            };
            this.allPages.push(parentPage);
            (docItem.headings || []).forEach(heading => {
                this.allPages.push({
                    title: heading.name,
                    id: heading.id,
                    path: `${path}#${heading.id}`,
                    parent: parentPage
                });
            });
        });
    }

    private searchPages(keywords: string) {
        const searchText = keywords?.trim().toLowerCase();
        if (searchText) {
            return this.allPages.filter(item => {
                return item.title.toLowerCase().indexOf(searchText) > -1;
            });
        } else {
            return [];
        }
    }

    public trackByFn(index: number, item: SearchPageInfo) {
        return item.id || index;
    }
}
