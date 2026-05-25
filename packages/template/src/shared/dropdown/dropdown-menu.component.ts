import { ChangeDetectionStrategy, Component, HostListener, inject, Optional, signal } from '@angular/core';
import { DropdownDirective } from './dropdown.directive';

@Component({
    selector: 'dg-dropdown-menu',
    templateUrl: './dropdown-menu.component.html',
    host: {
        class: 'dg-dropdown-menu',
        '[class.dg-dropdown-menu-open]': 'isOpen()',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownMenuComponent {
    readonly isOpen = signal(false);

    private dropdown = inject(DropdownDirective, { optional: true });

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
        this.isOpen.set(true);
    }

    close() {
        this.isOpen.set(false);
    }
}
