import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlibFooComponent } from './foo.component';

@NgModule({
    declarations: [AlibFooComponent],
    imports: [CommonModule],
    exports: [AlibFooComponent],
    providers: []
})
export class AlibFooModule {}
