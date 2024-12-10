import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocgeniLabelComponent } from './label/label.component';
import { DocgeniAlertComponent } from './alert/alert.component';
import { loadBuiltInComponents } from './loader';

@NgModule({
    declarations: [DocgeniLabelComponent, DocgeniAlertComponent],
    imports: [CommonModule],
    exports: [],
    providers: [],
})
export class DocgeniBuiltInModule {
    constructor() {
        loadBuiltInComponents();
    }
}
