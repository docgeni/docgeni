import { HttpClient } from '@angular/common/http';
import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs';

@Directive()
export abstract class ContentRenderer {
    private documentFetchSubscription: Subscription;

    @Input() set url(value: string) {
        if (value) {
            this.fetchDocument(value);
        }
    }

    @Input() set content(value: string) {
        if (value) {
            this.updateDocument(value);
        }
    }

    @Output() contentRendered = new EventEmitter<HTMLElement>();

    abstract updateDocument(content: string): void;

    abstract showError(url: string, error: Error): void;

    constructor(protected http: HttpClient) {}

    protected fetchDocument(url: string) {
        // Cancel previous pending request
        if (this.documentFetchSubscription) {
            this.documentFetchSubscription.unsubscribe();
        }
        this.documentFetchSubscription = this.http.get(url, { responseType: 'text' }).subscribe(
            response => {
                this.updateDocument(response);
            },
            error => {
                this.showError(url, error);
            }
        );
    }

    protected destroy() {
        this.documentFetchSubscription.unsubscribe();
    }
}
