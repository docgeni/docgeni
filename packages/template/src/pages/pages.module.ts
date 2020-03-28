import { NgModule, ApplicationRef } from '@angular/core';

import { ComponentViewerComponent } from './component-viewer/component-viewer.component';
import { DocViewerComponent } from './doc-viewer/doc-viewer.component';
import { docgeniTemplateSharedModule } from '../shared/shared.module';
import { DocHomeComponent } from './home/home.component';
import { DocChannelComponent } from './channel/channel.component';
import { DocRootComponent } from './root/root.component';

@NgModule({
    declarations: [ComponentViewerComponent, DocViewerComponent, DocChannelComponent, DocHomeComponent, DocRootComponent],
    imports: [docgeniTemplateSharedModule],
    providers: [],
    exports: [DocChannelComponent]
})
export class docgeniTemplatePagesModule {
    constructor(public appRef: ApplicationRef) {}
}

export { DocRootComponent, DocHomeComponent, DocChannelComponent, DocViewerComponent, ComponentViewerComponent };
