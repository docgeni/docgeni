import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlibButtonModule } from '@docgeni/alib/button';

@Component({
    selector: 'alib-button-basic-example',
    templateUrl: './basic.component.html',
    styleUrls: ['./basic.component.scss'],
    standalone: true,
    imports: [AlibButtonModule, CommonModule]
})
export class AlibButtonBasicExampleComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
