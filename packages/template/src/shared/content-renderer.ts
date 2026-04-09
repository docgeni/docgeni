import { HttpClient } from '@angular/common/http';
import { Directive, effect, EventEmitter, inject, input, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs';

@Directive()
export abstract class ContentRenderer {
    private documentFetchSubscription!: Subscription;

    url = input<string>();

    content = input<string>();

    @Output() contentRendered = new EventEmitter<HTMLElement>();

    abstract updateDocument(content: string): void;

    abstract showError(url: string, error: Error): void;

    protected http: HttpClient = inject(HttpClient);

    constructor() {
        effect(() => {
            if (this.url()) {
                this.fetchDocument(this.url()!);
            }
        });

        effect(() => {
            if (this.content()) {
                this.updateDocument(this.content()!);
            }
        });
    }

    protected fetchDocument(url: string) {
        // Cancel previous pending request
        if (this.documentFetchSubscription) {
            this.documentFetchSubscription.unsubscribe();
        }
        this.documentFetchSubscription = this.http.get(url, { responseType: 'text' }).subscribe(
            (response) => {
                this.updateDocument(response);
            },
            (error) => {
                this.showError(url, error);
            },
        );
    }

    protected destroy() {
        this.documentFetchSubscription.unsubscribe();
    }
}
