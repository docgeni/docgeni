import { Injectable, inject, signal } from '@angular/core';
import { GlobalContext } from './global-context';
import { DOCUMENT } from '@angular/common';

/** IME "Process" key reported by some browsers while composing CJK text. */
const IME_PROCESS_KEY_CODE = 229;

function isImeEnterKey(event: KeyboardEvent, composing: boolean, suppressEnter: boolean): boolean {
    return event.key === 'Enter' && (composing || suppressEnter || event.isComposing || event.keyCode === IME_PROCESS_KEY_CODE);
}

export interface SearchPageInfo {
    title: string;
    id: string;
    path: string;
    parent?: SearchPageInfo;
}

@Injectable({ providedIn: 'root' })
export class SearchService {
    global = inject(GlobalContext);
    private document = inject(DOCUMENT);

    private allPages: SearchPageInfo[] = [];

    readonly result = signal<SearchPageInfo[]>([]);

    public get hasAlgolia() {
        return !!(this.global.config.algolia && this.global.config.algolia.apiKey && this.global.config.algolia.indexName);
    }

    public initSearch(searchSelector: string) {
        if (this.hasAlgolia) {
            this.initAlgolia(searchSelector);
        } else {
            this.initInnerSearch(searchSelector);
        }
    }

    public search(keywords: string) {
        if (!this.allPages.length) {
            this.generatePages();
        }
        this.result.set(this.searchPages(keywords));
    }

    private async initAlgolia(searchSelector: string) {
        const algoliaConfig = this.global.config.algolia;
        const algolia = algoliaConfig?.appId
            ? {
                  appId: algoliaConfig.appId,
                  apiKey: algoliaConfig.apiKey,
                  indexName: algoliaConfig.indexName,
              }
            : {
                  apiKey: algoliaConfig?.apiKey,
                  indexName: algoliaConfig?.indexName,
              };

        (window as any).global = window;

        (window as any).process = {
            env: { DEBUG: undefined },
        };

        // @ts-ignore
        const { default: docsearch } = await import('docsearch.js');

        docsearch({
            ...algolia,
            inputSelector: searchSelector,
            algoliaOptions: {
                hitsPerPage: 5,
                facetFilters: [`lang: ${this.global.locale}`],
            },
            transformData: (hits: any) => {
                if (location.href.indexOf(this.global.locale) < 0) {
                    hits.forEach((hit: any) => {
                        hit.url = hit.url.replace(`${this.global.locale}/`, '');
                    });
                }
                return hits;
            },
            // debug: true
        });

        const searchInput = this.document.querySelector(searchSelector) as HTMLInputElement | null;
        if (searchInput) {
            this.bindImeEnterProtection(searchInput);
        }
    }

    private initInnerSearch(searchSelector: string) {
        this.generatePages();
        const searchContainer = this.document.querySelector(searchSelector) as HTMLInputElement | null;
        if (searchContainer) {
            this.bindImeEnterProtection(searchContainer);
        } else {
            throw new Error('not find search container');
        }
    }

    /**
     * Stop third-party/autocomplete Enter handling while IME is confirming text,
     * and re-emit `input` after composition so Algolia/docsearch can open.
     */
    private bindImeEnterProtection(input: HTMLInputElement) {
        let composing = false;
        let suppressEnter = false;

        input.addEventListener(
            'compositionstart',
            () => {
                composing = true;
            },
            true,
        );

        input.addEventListener(
            'compositionend',
            () => {
                composing = false;
                suppressEnter = true;
                // eslint-disable-next-line no-restricted-globals
                setTimeout(() => {
                    suppressEnter = false;
                }, 0);
                input.dispatchEvent(new Event('input', { bubbles: true }));
            },
            true,
        );

        input.addEventListener(
            'keydown',
            (event: KeyboardEvent) => {
                if (isImeEnterKey(event, composing, suppressEnter)) {
                    event.stopImmediatePropagation();
                }
            },
            true,
        );
    }

    private generatePages() {
        this.allPages = [];
        (this.global.docItems || []).forEach((docItem) => {
            const path = docItem.path;
            const parentPage = {
                title: `${docItem.title} ${docItem.subtitle ? docItem.subtitle : ''}`,
                id: docItem.id,
                path,
            };
            this.allPages.push(parentPage);
            (docItem.headings || []).forEach((heading) => {
                this.allPages.push({
                    title: heading.name,
                    id: heading.id,
                    path: `${path}#${heading.id}`,
                    parent: parentPage,
                });
            });
        });
    }

    private searchPages(keywords: string) {
        const searchText = keywords?.trim().toLowerCase();
        if (searchText) {
            return this.allPages.filter((item) => {
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
