import { Component, OnInit, HostBinding, ChangeDetectionStrategy, Input, OnDestroy } from '@angular/core';
import { GlobalContext, NavigationService } from '../../services/public-api';

@Component({
    selector: 'dg-doc-header',
    templateUrl: './doc-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocHeaderComponent implements OnInit, OnDestroy {
    @HostBinding(`class.dg-doc-header`) isHeader = true;

    @Input() title: string;

    @Input() subtitle: string;

    constructor(public navigationService: NavigationService, public global: GlobalContext) {}

    ngOnInit(): void {}

    toggleSidebar() {
        this.navigationService.toggleSidebar();
    }

    ngOnDestroy() {
        this.navigationService.resetShowSidebar();
    }
}
