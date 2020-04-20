import { NgModule, ApplicationRef } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DocComponentViewerComponent } from './component-viewer/component-viewer.component';
import { DocViewerComponent, DocViewerHomeComponent } from './doc-viewer/doc-viewer.component';
import { DocgeniTemplateSharedModule } from '../shared/shared.module';
import { DocHomeComponent } from './home/home.component';
import { DocChannelComponent } from './channel/channel.component';
import { DocRootComponent } from './root/root.component';
import { DocComponentOverviewComponent } from './component-viewer/overview/component-overview.component';
import { DocComponentApiComponent } from './component-viewer/api/component-api.component';
import { DocComponentExamplesComponent } from './component-viewer/examples/component-examples.component';

@NgModule({
    declarations: [
        DocRootComponent,
        DocHomeComponent,
        DocChannelComponent,
        DocViewerComponent,
        DocViewerHomeComponent,
        DocComponentViewerComponent,
        DocComponentOverviewComponent,
        DocComponentApiComponent,
        DocComponentExamplesComponent
    ],
    imports: [DocgeniTemplateSharedModule],
    providers: [],
    exports: [
        DocChannelComponent,
        DocViewerComponent,
        DocViewerHomeComponent,
        DocComponentViewerComponent,
        DocComponentOverviewComponent,
        DocComponentApiComponent,
        DocComponentExamplesComponent
    ]
})
export class DocgeniTemplatePagesModule {
    constructor(public appRef: ApplicationRef) {}
}

export { DocRootComponent, DocHomeComponent, DocChannelComponent, DocViewerComponent, DocComponentViewerComponent };
export * from './component-viewer';
