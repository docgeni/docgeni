import { Component, HostBinding, HostListener, Optional } from '@angular/core';
import { DropdownDirective } from './dropdown.directive';

@Component({
    selector: 'dg-dropdown-menu',
    templateUrl: './dropdown-menu.component.html',
    standalone: false,
    host: {
        class: 'dg-dropdown-menu',
    },
})
export class DropdownMenuComponent {
    @HostBinding('class.dg-dropdown-menu-open') isOpen = false;

    constructor(@Optional() private dropdown: DropdownDirective) {}

    @HostListener('mouseenter')
    onMouseEnter() {
        this.open();
    }

    @HostListener('mouseleave', ['$event'])
    onMouseLeave(event: MouseEvent) {
        const relatedTarget = event.relatedTarget as Node | null;
        if (relatedTarget && this.dropdown?.contains(relatedTarget)) {
            return;
        }
        this.dropdown?.close();
    }

    @HostListener('click')
    onClick() {
        this.dropdown?.close();
    }

    open() {
        this.isOpen = true;
    }

    close() {
        this.isOpen = false;
    }
}
