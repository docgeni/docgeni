import { HttpClient } from '@angular/common/http';
import { Component, OnInit, HostBinding, NgZone, ElementRef } from '@angular/core';
import { ComponentViewerComponent } from '../component-viewer.component';
import { GlobalContext } from '../../../services/public-api';
import { ApiDeclaration } from '../../../interfaces';
import { take } from 'rxjs/operators';
import { TocService } from '../../../services/toc.service';

@Component({
    selector: 'dg-component-api',
    templateUrl: './component-api.component.html',
    providers: [TocService]
})
export class ComponentApiComponent implements OnInit {
    @HostBinding('class.dg-component-api') contentClass = true;

    @HostBinding('class.dg-doc-content') isDocContent = true;

    // contentUrl: string;

    apiDeclarations: ApiDeclaration[];

    constructor(
        public componentViewer: ComponentViewerComponent,
        private global: GlobalContext,
        private http: HttpClient,
        private ngZone: NgZone,
        private elementRef: ElementRef,
        private tocService: TocService
    ) {}

    ngOnInit(): void {
        // this.contentUrl = this.global.getAssetsContentPath(
        //     `api-docs/${this.componentViewer.docItem.importSpecifier}/${this.global.locale}.html`
        // );
        const apiUrl = this.global.getAssetsContentPath(
            `api-docs/${this.componentViewer.docItem.importSpecifier}/${this.global.locale}.json`
        );
        this.http.get<ApiDeclaration[]>(apiUrl).subscribe({
            next: data => {
                this.apiDeclarations = data;
                this.ngZone.onStable.pipe(take(1)).subscribe(() => {
                    this.ngZone.run(() => {
                        if (this.elementRef.nativeElement) {
                            this.tocService.generateToc(this.elementRef.nativeElement);
                        }
                    });
                });
            }
        });
    }
}
