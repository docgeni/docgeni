import { ComponentPortal, DomPortal, Portal, PortalOutlet } from '@angular/cdk/portal';
import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injector } from '@angular/core';

export class DomPortalOutlet implements PortalOutlet {
    private disposeFn: (() => void) | null;
    private isDisposed: boolean;

    protected attachedPortal: Portal<unknown>;

    constructor(
        protected outletElement: Element,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected appRef: ApplicationRef,
        protected defaultInjector: Injector
    ) {}

    attach<T>(portal: ComponentPortal<T>) {
        const resolver = portal.componentFactoryResolver || this.componentFactoryResolver;
        const componentFactory = resolver.resolveComponentFactory(portal.component);
        let componentRef: ComponentRef<T>;

        // If the portal specifies a ViewContainerRef, we will use that as the attachment point
        // for the component (in terms of Angular's component tree, not rendering).
        // When the ViewContainerRef is missing, we use the factory to create the component directly
        // and then manually attach the view to the application.
        if (portal.viewContainerRef) {
            componentRef = portal.viewContainerRef.createComponent(
                componentFactory,
                portal.viewContainerRef.length,
                portal.injector || portal.viewContainerRef.injector
            );

            this.setDisposeFn(() => {
                componentRef.destroy();
            });
        } else {
            componentRef = componentFactory.create(portal.injector || this.defaultInjector);
            this.appRef.attachView(componentRef.hostView);
            this.setDisposeFn(() => {
                this.appRef.detachView(componentRef.hostView);
                componentRef.destroy();
            });
        }
        // At this point the component has been instantiated, so we move it to the location in the DOM
        // where we want it to be rendered.
        this.outletElement.replaceWith(this.getComponentRootNode(componentRef));
        // this.outletElement.appendChild(this._getComponentRootNode(componentRef));
        this.attachedPortal = portal;

        return componentRef;
    }

    hasAttached(): boolean {
        return !!this.attachedPortal;
    }

    /** Detaches a previously attached portal. */
    detach(): void {
        if (this.attachedPortal) {
            this.attachedPortal.setAttachedHost(null);
            this.attachedPortal = null;
        }

        this.invokeDisposeFn();
    }

    /** Permanently dispose of this portal host. */
    dispose(): void {
        if (this.hasAttached()) {
            this.detach();
        }

        this.invokeDisposeFn();
        this.isDisposed = true;
    }

    /** @docs-private */
    setDisposeFn(fn: () => void) {
        this.disposeFn = fn;
    }

    private invokeDisposeFn() {
        if (this.disposeFn) {
            this.disposeFn();
            this.disposeFn = null;
        }
    }

    /** Gets the root HTMLElement for an instantiated component. */
    private getComponentRootNode(componentRef: ComponentRef<any>): HTMLElement {
        return (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    }
}
