import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, computed, viewChild } from '@angular/core';
import { ContentRenderer } from '../content-renderer';

@Component({
    selector: 'dg-source-code, [dgSourceCode]',
    templateUrl: './source-code.component.html',
    host: {
        class: 'dg-source-code',
    },
    standalone: false,
})
export class SourceCodeComponent extends ContentRenderer implements OnInit {
    codeContent = viewChild('codeContent', { read: ElementRef });

    textContent = computed(() => {
        return this.codeContent()?.nativeElement?.textContent;
    });

    ngOnInit(): void {}

    updateDocument(content: string): void {
        if (this.codeContent() && this.codeContent()?.nativeElement) {
            this.codeContent()!.nativeElement.innerHTML = content;
        }
    }

    showError(url: string, error: any): void {
        console.log(error);
        if (this.textContent() && this.textContent().nativeElement) {
            this.codeContent()!.nativeElement.innerText = `Failed to load document: ${url}. Error: ${error.statusText}`;
        }
    }
}
