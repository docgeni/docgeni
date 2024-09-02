import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy } from '@angular/core';
import { GlobalContext, NavigationService } from '../../services/public-api';

@Component({
    selector: 'dg-doc-header',
    templateUrl: './doc-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocHeaderComponent implements OnInit, OnDestroy {
    @Input() title!: string;

    @Input() subtitle!: string;

    constructor(
        public navigationService: NavigationService,
        public global: GlobalContext,
    ) {}

    ngOnInit(): void {}

    toggleSidebar(event: Event) {
        this.navigationService.toggleSidebar();
        event.stopPropagation();
    }

    ngOnDestroy() {
        this.navigationService.resetShowSidebar();
    }
}
