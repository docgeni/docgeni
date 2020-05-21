import {
    Component,
    OnInit,
    Input,
    ElementRef,
    HostBinding,
    ApplicationRef,
    ComponentFactoryResolver,
    Injector,
    ViewContainerRef,
    NgZone,
    Output,
    EventEmitter,
    OnDestroy
} from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DomPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import { DomSanitizer } from '@angular/platform-browser';
import { ExampleViewerComponent } from '../example-viewer/example-viewer.component';
import { Subscription } from 'rxjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
    selector: 'dg-content-viewer',
    template: 'Loading...'
})
export class ContentViewerComponent implements OnInit, OnDestroy {
    @HostBinding('class.dg-doc-content') isDocContent = true;

    @Input() set url(value: string) {
        if (value) {
            this.fetchDocument(value);
        }
    }

    @Output() contentRendered = new EventEmitter<HTMLElement>();

    private portalHosts: DomPortalOutlet[] = [];

    private documentFetchSubscription: Subscription;

    private fetchDocument(url: string) {
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

    private updateDocument(content: string) {
        this.elementRef.nativeElement.innerHTML = content;
        this.loadComponents('example', ExampleViewerComponent);
    }

    private loadComponents(selector: string, componentClass: any) {
        const exampleElements = this.elementRef.nativeElement.querySelectorAll(selector);

        Array.prototype.slice.call(exampleElements).forEach((element: Element) => {
            const exampleName = element.getAttribute('name');
            const inline = element.getAttribute('inline');
            const portalHost = new DomPortalOutlet(element, this.componentFactoryResolver, this.appRef, this.injector);
            const examplePortal = new ComponentPortal(componentClass, this.viewContainerRef);
            const exampleViewerRef = portalHost.attach(examplePortal);
            if (exampleName !== null) {
                const exampleViewer = exampleViewerRef.instance as ExampleViewerComponent;
                exampleViewer.exampleName = exampleName;
                exampleViewer.inline = coerceBooleanProperty(inline);
            }

            this.portalHosts.push(portalHost);
        });
    }

    /** Show an error that occurred when fetching a document. */
    private showError(url: string, error: HttpErrorResponse) {
        console.log(error);
        this.elementRef.nativeElement.innerText = `Failed to load document: ${url}. Error: ${error.statusText}`;
    }

    constructor(
        private http: HttpClient,
        public elementRef: ElementRef<HTMLElement>,
        private appRef: ApplicationRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private injector: Injector,
        private viewContainerRef: ViewContainerRef,
        private ngZone: NgZone,
        private domSanitizer: DomSanitizer
    ) {}

    ngOnInit(): void {}

    private clearLiveExamples() {
        this.portalHosts.forEach(h => h.dispose());
        this.portalHosts = [];
    }

    ngOnDestroy() {
        this.clearLiveExamples();

        if (this.documentFetchSubscription) {
            this.documentFetchSubscription.unsubscribe();
        }
    }
}
