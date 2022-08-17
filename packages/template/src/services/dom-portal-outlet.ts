import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injector, ViewContainerRef } from '@angular/core';

export interface ComponentType<T> {
    new (...args: any[]): T;
}

export interface PortalOutlet {
    /** Attaches a portal to this outlet. */
    attach(portal: Portal<any>): any;

    /** Detaches the currently attached portal from this outlet. */
    detach(): any;

    /** Performs cleanup before the outlet is destroyed. */
    dispose(): void;

    /** Whether there is currently a portal attached to this outlet. */
    hasAttached(): boolean;
}

export abstract class Portal<T> {
    private _attachedHost: PortalOutlet | null;

    /** Attach this portal to a host. */
    attach(host: PortalOutlet): T {
        this._attachedHost = host;
        return <T>host.attach(this);
    }

    /** Detach this portal from its host */
    detach(): void {
        const host = this._attachedHost;

        if (host !== null) {
            this._attachedHost = null;
            host.detach();
        }
    }

    /** Whether this portal is attached to a host. */
    get isAttached(): boolean {
        return this._attachedHost !== null;
    }

    /**
     * Sets the PortalOutlet reference without performing `attach()`. This is used directly by
     * the PortalOutlet when it is performing an `attach()` or `detach()`.
     */
    setAttachedHost(host: PortalOutlet | null) {
        this._attachedHost = host;
    }
}

/**
 * A `ComponentPortal` is a portal that instantiates some Component upon attachment.
 */
export class ComponentPortal<T> extends Portal<ComponentRef<T>> {
    /** The type of the component that will be instantiated for attachment. */
    component: ComponentType<T>;

    /**
     * [Optional] Where the attached component should live in Angular's *logical* component tree.
     * This is different from where the component *renders*, which is determined by the PortalOutlet.
     * The origin is necessary when the host is outside of the Angular application context.
     */
    viewContainerRef?: ViewContainerRef | null;

    /** [Optional] Injector used for the instantiation of the component. */
    injector?: Injector | null;

    /**
     * Alternate `ComponentFactoryResolver` to use when resolving the associated component.
     * Defaults to using the resolver from the outlet that the portal is attached to.
     */
    componentFactoryResolver?: ComponentFactoryResolver | null;

    constructor(
        component: ComponentType<T>,
        viewContainerRef?: ViewContainerRef | null,
        injector?: Injector | null,
        componentFactoryResolver?: ComponentFactoryResolver | null
    ) {
        super();
        this.component = component;
        this.viewContainerRef = viewContainerRef;
        this.injector = injector;
        this.componentFactoryResolver = componentFactoryResolver;
    }
}

export class DomPortalOutlet implements PortalOutlet {
    private disposeFn: (() => void) | null;
    private isDisposed: boolean;

    protected attachedPortal: Portal<unknown>;

    constructor(
        protected outletElement: Element,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected appRef: ApplicationRef,
        protected defaultInjector: Injector,
        protected projectableNodes: any[][]
    ) {}

    attach<T>(portal: ComponentPortal<T>, replace: boolean = false): ComponentRef<T> {
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
                portal.injector || portal.viewContainerRef.injector,
                this.projectableNodes
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
        if (replace) {
            this.outletElement.replaceWith(this.getComponentRootNode(componentRef));
        } else {
            this.outletElement.appendChild(this.getComponentRootNode(componentRef));
        }
        //
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
