import { HttpClient } from '@angular/common/http';
import { Component, Input, HostBinding, OnChanges, inject, signal, input, effect, untracked } from '@angular/core';
import { DocItem } from '../../interfaces';
import { GlobalContext } from '../../services/global-context';
import { filter } from 'rxjs/operators';

interface GitHubCommieInfo {
    author: { avatar_url: string; login: string };
    commit: { author: { date: string } };
}

@Component({
    selector: 'dg-doc-meta',
    templateUrl: './doc-meta.component.html',
    host: {
        class: 'dg-doc-meta',
        '[class.dg-d-none]': 'hideDocMeta()',
    },
    standalone: false,
})
export class DocMetaComponent implements OnChanges {
    protected readonly hideDocMeta = signal(false);
    lastUpdatedTime = signal<Date | undefined>(undefined);
    contributors = signal<string[] | undefined>(undefined);
    private http = inject(HttpClient);
    private globalContext = inject(GlobalContext);

    docItem = input.required<DocItem>();

    constructor() {
        effect(() => {
            const docItem = this.docItem();
            untracked(() => {
                if (docItem.originPath && this.globalContext.owner && this.globalContext.repo) {
                    this.http
                        .get<GitHubCommieInfo[]>(
                            `https://api.github.com/repos/${this.globalContext.owner}/${this.globalContext.repo}/commits`,
                            {
                                params: { path: docItem.originPath },
                            },
                        )
                        .pipe(filter((result) => !!result.length))
                        .subscribe((result) => {
                            this.contributors.set(Array.from(new Set(result.map((item) => item.author.login))));
                            this.lastUpdatedTime.set(new Date(result[0].commit.author.date));
                            this.hideDocMeta.set(false);
                        });
                } else {
                    this.contributors.set(undefined);
                    this.lastUpdatedTime.set(undefined);
                    this.hideDocMeta.set(true);
                }
            });
        });
    }

    ngOnChanges(): void {}
}
