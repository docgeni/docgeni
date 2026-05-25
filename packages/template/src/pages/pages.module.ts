import { NgModule, ApplicationRef, inject } from '@angular/core';

import { ComponentViewerComponent, ComponentEmptyComponent } from './component-viewer/component-viewer.component';
import { DocViewerComponent, DocViewerHomeComponent } from './doc-viewer/doc-viewer.component';
import { DocgeniSharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { ChannelComponent, ChannelHomeComponent } from './channel/channel.component';
import { ActualRootComponent, RootComponent } from './root/root.component';
import { ComponentOverviewComponent } from './component-viewer/overview/component-overview.component';
import { ComponentApiComponent } from './component-viewer/api/component-api.component';
import { ComponentExamplesComponent } from './component-viewer/examples/component-examples.component';
import { ExampleIsolatedViewerComponent } from './example/example.component';

const COMPONENTS = [
    ActualRootComponent,
    HomeComponent,
    ChannelComponent,
    ChannelHomeComponent,
    DocViewerComponent,
    DocViewerHomeComponent,
    ComponentViewerComponent,
    ComponentOverviewComponent,
    ComponentApiComponent,
    ComponentExamplesComponent,
    ComponentEmptyComponent,
    ExampleIsolatedViewerComponent,
];
@NgModule({
    imports: [DocgeniSharedModule, RootComponent, ...COMPONENTS],
    providers: [],
    exports: [...COMPONENTS, RootComponent],
})
export class DocgeniPagesModule {
    appRef = inject(ApplicationRef);
}

export {
    ActualRootComponent,
    RootComponent,
    HomeComponent,
    ChannelComponent,
    DocViewerComponent,
    DocViewerHomeComponent,
    ComponentViewerComponent,
    ComponentOverviewComponent,
    ComponentApiComponent,
    ComponentExamplesComponent,
    ComponentEmptyComponent,
};
