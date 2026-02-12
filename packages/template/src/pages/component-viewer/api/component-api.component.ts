import { HttpClient } from '@angular/common/http';
import { Component, OnInit, NgZone, ElementRef, inject, signal } from '@angular/core';
import { ComponentViewerComponent } from '../component-viewer.component';
import { GlobalContext } from '../../../services/public-api';
import { ApiDeclaration } from '../../../interfaces';
import { take } from 'rxjs/operators';
import { TocService } from '../../../services/toc.service';

@Component({
    selector: 'dg-component-api',
    templateUrl: './component-api.component.html',
    providers: [TocService],
    host: {
        class: 'dg-component-api',
    },
    standalone: false,
})
export class ComponentApiComponent implements OnInit {
    apiDeclarations = signal<ApiDeclaration[] | undefined>(undefined);
    componentViewer = inject(ComponentViewerComponent);
    private global: GlobalContext = inject(GlobalContext);
    private http: HttpClient = inject(HttpClient);
    private ngZone: NgZone = inject(NgZone);
    private elementRef: ElementRef = inject(ElementRef);
    private tocService: TocService = inject(TocService);

    constructor() {}

    ngOnInit(): void {
        // this.contentUrl = this.global.getAssetsContentPath(
        //     `api-docs/${this.componentViewer.docItem.importSpecifier}/${this.global.locale}.html`
        // );
        const apiUrl = this.global.getAssetsContentPath(
            `api-docs/${this.componentViewer.docItem().importSpecifier}/${this.global.locale}.json`,
        );
        this.http.get<ApiDeclaration[]>(apiUrl).subscribe({
            next: (data) => {
                this.apiDeclarations.set(data);
                if (this.elementRef.nativeElement) {
                    setTimeout(() => {
                        this.tocService.generateToc(this.elementRef.nativeElement);
                    });
                }
            },
        });
    }
}
