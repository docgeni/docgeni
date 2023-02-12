import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ContentRenderer } from '../content-renderer';

@Component({
    selector: 'dg-source-code, [dgSourceCode]',
    templateUrl: './source-code.component.html',
    host: {
        class: 'dg-source-code'
    }
})
export class SourceCodeComponent extends ContentRenderer implements OnInit {
    @ViewChild('codeContent', { static: true, read: ElementRef }) codeContent!: ElementRef;

    get textContent() {
        return this.codeContent.nativeElement?.textContent;
    }

    constructor(http: HttpClient) {
        super(http);
    }

    ngOnInit(): void {}

    updateDocument(content: string): void {
        this.codeContent.nativeElement.innerHTML = content;
    }

    showError(url: string, error: any): void {
        console.log(error);
        this.codeContent.nativeElement.innerText = `Failed to load document: ${url}. Error: ${error.statusText}`;
    }
}
