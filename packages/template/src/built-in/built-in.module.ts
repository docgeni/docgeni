import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { setBuiltInComponents } from './built-in-components';
import label from './label/label.component';
import alert from './alert/alert.component';

@NgModule({
    declarations: [label.component, alert.component],
    imports: [CommonModule],
    exports: [],
    providers: [],
    entryComponents: [label.component, alert.component]
})
export class DocgeniBuiltInModule {
    constructor() {}
}

setBuiltInComponents([label, alert]);
