import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'dg-content-viewer',
    template: 'Loading...'
})
export class ContentViewerComponent implements OnInit {
    @Input() set url(value: string) {
        if (value) {
            this.fetchDocument(value);
        }
    }

    private fetchDocument(url: string) {
        this.http.get(url, { responseType: 'text' }).subscribe(response => {
            this.elementRef.nativeElement.innerHTML = response;
        });
    }

    constructor(private http: HttpClient, private elementRef: ElementRef<HTMLElement>) {}

    ngOnInit(): void {}
}
