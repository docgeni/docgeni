import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlibBarBasicExampleComponent } from './basic/basic.component';

@NgModule({
    declarations: [AlibBarBasicExampleComponent],
    imports: [CommonModule],
    exports: [AlibBarBasicExampleComponent],
    providers: []
})
export class AlibBarExamplesModule {}
