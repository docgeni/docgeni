import { Route, Router, Routes } from '@angular/router';
import { NavigationService } from './../../services/navigation.service';
import { Component, HostBinding } from '@angular/core';
import { GlobalContext } from '../../services/public-api';
import { ChannelItem } from '../../interfaces';
import { DocViewerComponent, DocViewerHomeComponent } from '../doc-viewer/doc-viewer.component';
import {
    ComponentApiComponent,
    ComponentEmptyComponent,
    ComponentExamplesComponent,
    ComponentOverviewComponent
} from '../component-viewer';
import { ChannelComponent } from '../channel/channel.component';
import { RouterResetService } from '../../services/router-reset.service';

const componentChildrenRoutes: Routes = [
    {
        path: '',
        component: DocViewerHomeComponent
    },
    {
        path: 'overview',
        component: ComponentOverviewComponent
    },
    {
        path: 'api',
        component: ComponentApiComponent
    },
    {
        path: 'examples',
        component: ComponentExamplesComponent
    },
    {
        path: 'empty',
        component: ComponentEmptyComponent
    },
    {
        path: '**',
        component: ComponentExamplesComponent
    }
];
@Component({
    selector: 'dg-root',
    templateUrl: './root.component.html'
})
export class RootComponent {
    @HostBinding(`class.dg-main`) isMain = true;

    @HostBinding(`class.dg-layout`) isLayout = true;

    @HostBinding(`class.dg-sidebar-show`) get showSidebar() {
        return this.navigationService.channel && this.navigationService.showSidebar;
    }

    constructor(public global: GlobalContext, public navigationService: NavigationService) {}
}
