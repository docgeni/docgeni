import { ContentChild, Directive, ElementRef, HostBinding, HostListener } from '@angular/core';
import { DropdownMenuComponent } from './dropdown-menu.component';

@Directive({
    selector: '[dgDropdown]',
    standalone: false,
    host: {
        class: 'dg-dropdown',
    },
})
export class DropdownDirective {
    @ContentChild(DropdownMenuComponent) menu?: DropdownMenuComponent;

    @HostBinding('class.dg-dropdown-open') isOpen = false;

    constructor(private elementRef: ElementRef<HTMLElement>) {}

    @HostListener('mouseenter')
    onMouseEnter() {
        this.open();
    }

    @HostListener('mouseleave', ['$event'])
    onMouseLeave(event: MouseEvent) {
        if (this.isMovingToMenu(event)) {
            return;
        }
        this.close();
    }

    close() {
        this.isOpen = false;
        this.menu?.close();
    }

    contains(node: Node): boolean {
        return this.elementRef.nativeElement.contains(node);
    }

    private open() {
        this.isOpen = true;
        this.menu?.open();
    }

    private isMovingToMenu(event: MouseEvent): boolean {
        const relatedTarget = event.relatedTarget as Node | null;
        return !!relatedTarget && this.elementRef.nativeElement.contains(relatedTarget);
    }
}
