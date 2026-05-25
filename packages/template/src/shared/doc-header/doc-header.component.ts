import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy } from '@angular/core';
import { GlobalContext, NavigationService } from '../../services/public-api';
import { IconComponent } from '../icon/icon.component';
import { IsModeLitePipe, IsModeFullPipe } from '../pipes/mode.pipe';

@Component({
    selector: 'dg-doc-header',
    templateUrl: './doc-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [IconComponent, IsModeLitePipe, IsModeFullPipe],
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
