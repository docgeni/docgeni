import { CommonModule } from '@angular/common';
import { AlibButtonModule } from '@docgeni/alib/button';
import { AlibButtonOtherExampleComponent } from './basic/other.component';
import { AlibButtonBasicExampleComponent } from './basic/basic.component';
import { NgModule } from '@angular/core';

export default {
    imports: [CommonModule, AlibButtonModule],
    providers: [],
    declarations: [AlibButtonOtherExampleComponent]
};

@NgModule({
    declarations: [ AlibButtonOtherExampleComponent, AlibButtonBasicExampleComponent ],
    entryComponents: [ AlibButtonBasicExampleComponent ],
    providers: [  ],
    imports: [ CommonModule, AlibButtonModule ],
    exports: [ AlibButtonBasicExampleComponent ]
})
export class AlibButtonExamplesModule {}
