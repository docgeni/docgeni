import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, HostBinding } from '@angular/core';
import { DocItem } from '@docgeni/template/interfaces';
import { GlobalContext } from '@docgeni/template/services/public-api';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'dg-doc-meta',
    templateUrl: './doc-meta.component.html'
})
export class DocMetaComponent implements OnInit {
    @HostBinding(`class.dg-doc-meta`) isDocContribution = true;
    @Input() docItem: DocItem;
    lastUpdatedTime: Date;
    contributors: string[];
    constructor(private http: HttpClient, private globalContext: GlobalContext) {}

    ngOnInit() {
        if (this.globalContext.owner && this.globalContext.repo) {
            this.http
                .get(`https://api.github.com/repos/${this.globalContext.owner}/${this.globalContext.repo}/commits`, {
                    params: { path: this.docItem.originPath }
                })
                .pipe(filter((result: any[]) => !!result.length))
                .subscribe((result: { author: { avatar_url: string; login: string }; commit: { author: { date: string } } }[]) => {
                    this.contributors = Array.from(new Set(result.map(item => item.author.login)));
                    this.lastUpdatedTime = new Date(result[0].commit.author.date);
                });
        }
    }
}
