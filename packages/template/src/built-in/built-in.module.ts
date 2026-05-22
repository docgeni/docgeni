import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocgeniLabelComponent } from './label/label.component';
import { DocgeniAlertComponent } from './alert/alert.component';
import { DocgeniTabsComponent } from './tabs/tabs.component';
import { DocgeniCodeCopyComponent } from './code-copy/code-copy.component';
import { loadBuiltInComponents } from './loader';

@NgModule({
    declarations: [DocgeniLabelComponent, DocgeniAlertComponent, DocgeniTabsComponent, DocgeniCodeCopyComponent],
    imports: [CommonModule],
    exports: [],
    providers: [],
})
export class DocgeniBuiltInModule {
    constructor() {
        loadBuiltInComponents();
    }
}
