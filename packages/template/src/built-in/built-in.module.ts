import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocgeniSharedModule } from '../shared/shared.module';
import { DocgeniLabelComponent } from './label/label.component';

@NgModule({
    declarations: [DocgeniLabelComponent],
    imports: [CommonModule, DocgeniSharedModule],
    exports: [],
    providers: [],
    entryComponents: [DocgeniLabelComponent]
})
export class DocgeniBuiltInModule {}
