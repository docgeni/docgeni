import { contentChild, Directive, ElementRef, HostListener, inject, signal } from '@angular/core';
import { DropdownMenuComponent } from './dropdown-menu.component';

@Directive({
    selector: '[dgDropdown]',
    host: {
        class: 'dg-dropdown',
        '[class.dg-dropdown-open]': 'isOpen()',
    },
})
export class DropdownDirective {
    readonly isOpen = signal(false);

    readonly menu = contentChild(DropdownMenuComponent);

    private elementRef = inject(ElementRef<HTMLElement>);

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
        this.isOpen.set(false);
        this.menu()?.close();
    }

    contains(node: Node): boolean {
        return this.elementRef.nativeElement.contains(node);
    }

    private open() {
        this.isOpen.set(true);
        this.menu()?.open();
    }

    private isMovingToMenu(event: MouseEvent): boolean {
        const relatedTarget = event.relatedTarget as Node | null;
        return !!relatedTarget && this.elementRef.nativeElement.contains(relatedTarget);
    }
}
