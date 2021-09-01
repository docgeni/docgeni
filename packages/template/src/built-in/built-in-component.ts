import { Directive, ElementRef, Injectable } from '@angular/core';

@Directive()
export abstract class DocgeniBuiltInComponent {
    private classes: string[] = [];

    get hostElement(): HTMLElement {
        return this.elementRef.nativeElement;
    }

    constructor(private elementRef: ElementRef) {}

    setContentProjection(_innerHTML: string, contentNodes: NodeListOf<ChildNode>) {
        const dgContent = this.hostElement.querySelector('#dg-content');
        if (dgContent && contentNodes) {
            contentNodes.forEach((node, index) => {
                index === 0 ? dgContent.replaceWith(node) : dgContent.after(node);
            });
        }
    }

    setAttribute(qualifiedName: string, value: string) {
        this[qualifiedName] = value;
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
