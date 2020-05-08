import { NgModule, ApplicationRef } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentViewerComponent } from './component-viewer/component-viewer.component';
import { DocViewerComponent, DocViewerHomeComponent } from './doc-viewer/doc-viewer.component';
import { DocgeniSharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { ChannelComponent } from './channel/channel.component';
import { RootComponent } from './root/root.component';
import { ComponentOverviewComponent } from './component-viewer/overview/component-overview.component';
import { ComponentApiComponent } from './component-viewer/api/component-api.component';
import { ComponentExamplesComponent } from './component-viewer/examples/component-examples.component';

const COMPONENTS = [
    HomeComponent,
    ChannelComponent,
    DocViewerComponent,
    DocViewerHomeComponent,
    ComponentViewerComponent,
    ComponentOverviewComponent,
    ComponentApiComponent,
    ComponentExamplesComponent
];
@NgModule({
    declarations: [RootComponent, ...COMPONENTS],
    imports: [DocgeniSharedModule],
    providers: [],
    exports: [...COMPONENTS]
})
export class DocgeniPagesModule {
    constructor(public appRef: ApplicationRef) {}
}

export {
    RootComponent,
    HomeComponent,
    ChannelComponent,
    DocViewerComponent,
    DocViewerHomeComponent,
    ComponentViewerComponent,
    ComponentOverviewComponent,
    ComponentApiComponent,
    ComponentExamplesComponent
};
