import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AlibFooComponent } from './foo.component';

@NgModule({
    declarations: [],
    imports: [CommonModule, AlibFooComponent],
    exports: [AlibFooComponent],
    providers: []
})
export class AlibFooModule {}
