import { HttpClient } from '@angular/common/http';
import { Component, Input, HostBinding, OnChanges } from '@angular/core';
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
    },
    standalone: false,
})
export class DocMetaComponent implements OnChanges {
    @HostBinding(`class.dg-d-none`) hideDocMeta = true;
    @Input() docItem!: DocItem;
    lastUpdatedTime: Date | undefined;
    contributors: string[] | undefined;

    constructor(
        private http: HttpClient,
        private globalContext: GlobalContext,
    ) {}

    ngOnChanges(): void {
        if (this.docItem.originPath && this.globalContext.owner && this.globalContext.repo) {
            this.http
                .get<GitHubCommieInfo[]>(`https://api.github.com/repos/${this.globalContext.owner}/${this.globalContext.repo}/commits`, {
                    params: { path: this.docItem.originPath },
                })
                .pipe(filter((result) => !!result.length))
                .subscribe((result: GitHubCommieInfo[]) => {
                    this.contributors = Array.from(new Set(result.map((item) => item.author.login)));
                    this.lastUpdatedTime = new Date(result[0].commit.author.date);
                    this.hideDocMeta = false;
                });
        } else {
            this.contributors = undefined;
            this.lastUpdatedTime = undefined;
            this.hideDocMeta = true;
        }
    }
}
