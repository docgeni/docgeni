import { Directive, ElementRef, Type } from '@angular/core';

@Directive()
export abstract class DocgeniBuiltInComponent {
    private classes: string[] = [];

    get hostElement(): HTMLElement {
        return this.elementRef.nativeElement;
    }

    constructor(protected elementRef: ElementRef) {}

    setAttribute(qualifiedName: string, value: string) {
        (this as any)[qualifiedName] = value;
        this.hostElement.setAttribute(qualifiedName, value);
    }

    updateHostClass(classes: string[]) {
        if (this.classes) {
            this.classes.forEach(className => {
                if (!this.classes.includes(className)) {
                    this.removeClass(className);
                }
            });
        }
        const newClasses: string[] = [];
        classes.forEach(className => {
            if (className) {
                newClasses.push(className);
                if (!this.classes.includes(className)) {
                    this.addClass(className);
                }
            }
        });
        this.classes = newClasses;
        return this;
    }

    addClass(className: string) {
        this.hostElement.classList.add(className);
    }

    removeClass(className: string) {
        this.hostElement.classList.remove(className);
    }
}

export interface BuiltInComponentDef {
    selector: string;
    component: Type<unknown>;
}
