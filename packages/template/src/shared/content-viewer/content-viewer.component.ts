import {
    Component,
    OnInit,
    ElementRef,
    ApplicationRef,
    ComponentFactoryResolver,
    Injector,
    ViewContainerRef,
    NgZone,
    OnDestroy,
    Type,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    reflectComponentType,
} from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ExampleViewerComponent } from '../example-viewer/example-viewer.component';
import { take } from 'rxjs/operators';
import { ComponentPortal, DomPortalOutlet } from '../../services/dom-portal-outlet';
import { getBuiltInComponents } from '../../built-in/built-in-components';
import { ContentRenderer } from '../content-renderer';
import { TocService } from '../../services/toc.service';

@Component({
    selector: 'dg-content-viewer',
    template: 'Loading...',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'dg-doc-content',
    },
    standalone: false,
})
export class ContentViewerComponent extends ContentRenderer implements OnInit, OnDestroy {
    private portalHosts: DomPortalOutlet[] = [];

    constructor(
        http: HttpClient,
        public elementRef: ElementRef<HTMLElement>,
        private appRef: ApplicationRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private injector: Injector,
        private viewContainerRef: ViewContainerRef,
        private ngZone: NgZone,
        private tocService: TocService,
        private cdr: ChangeDetectorRef,
    ) {
        super(http);
    }

    ngOnInit(): void {}

    updateDocument(content: string) {
        this.elementRef.nativeElement.innerHTML = content;
        this.loadComponents('example', ExampleViewerComponent);
        getBuiltInComponents().forEach((item) => {
            this.loadComponents(item.selector, item.component, true);
        });

        this.cdr.markForCheck();

        // Resolving and creating components dynamically in Angular happens synchronously, but since
        // we want to emit the output if the components are actually rendered completely, we wait
        // until the Angular zone becomes stable.
        this.ngZone.onStable.pipe(take(1)).subscribe(() => {
            this.ngZone.run(() => {
                this.contentRendered.emit(this.elementRef.nativeElement);
                this.updateTableOfContents(this.elementRef.nativeElement);
            });
        });
    }

    updateTableOfContents(docViewerContent: HTMLElement) {
        if (docViewerContent) {
            this.tocService.generateToc(docViewerContent);
        }
    }

    private loadComponents(selector: string, componentClass: Type<unknown>, replace: boolean = false) {
        const exampleElements = this.elementRef.nativeElement.querySelectorAll(selector);
        Array.prototype.slice.call(exampleElements).forEach((element: Element) => {
            const portalHost = new DomPortalOutlet(element, this.componentFactoryResolver, this.appRef, this.injector, [
                element.childNodes as any,
            ]);
            const examplePortal = new ComponentPortal(componentClass, this.viewContainerRef);
            const exampleViewerRef = portalHost.attach<any>(examplePortal, replace);
            // 循环设置属性
            const compMetadata = reflectComponentType(componentClass);
            const inputsOfKey =
                compMetadata?.inputs.reduce(
                    (result, item) => {
                        result[item.templateName] = item;
                        return result;
                    },
                    {} as Record<string, any>,
                ) || {};

            for (const attributeKey in element.attributes) {
                if (Object.prototype.hasOwnProperty.call(element.attributes, attributeKey)) {
                    const attribute = element.attributes[attributeKey];
                    const qualifiedName = attribute.nodeName;
                    // eslint-disable-next-line dot-notation
                    const setAttributeFn: (qualifiedName: string, value: string) => void = exampleViewerRef.instance['setAttribute'];
                    if (inputsOfKey[attribute.nodeName]) {
                        exampleViewerRef.setInput(qualifiedName, element.getAttribute(qualifiedName));
                    } else {
                        exampleViewerRef.instance[qualifiedName] = element.getAttribute(qualifiedName);
                    }
                    if (setAttributeFn) {
                        setAttributeFn.call(exampleViewerRef.instance, qualifiedName, element.getAttribute(qualifiedName) || '');
                    }
                }
            }
            this.portalHosts.push(portalHost);
        });
    }

    /** Show an error that occurred when fetching a document. */
    showError(url: string, error: HttpErrorResponse) {
        console.log(error);
        this.elementRef.nativeElement.innerText = `Failed to load document: ${url}. Error: ${error.statusText}`;
    }

    private clearLiveExamples() {
        this.portalHosts.forEach((h) => h.dispose());
        this.portalHosts = [];
    }

    ngOnDestroy() {
        this.clearLiveExamples();

        this.tocService.reset();
        super.destroy();
    }
}
