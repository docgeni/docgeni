import { Component } from '@angular/core';
import { ButtonModule } from 'alib/button';

@Component({
    selector: 'app-basic',
    templateUrl: './basic.component.html',
    styleUrls: ['./basic.component.css'],
    imports: [ButtonModule],
})
export class AlibButtonBasicExampleComponent {
    constructor() {}
}
