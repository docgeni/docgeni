import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlibButtonModule } from '@docgeni/alib/button';

@Component({
    selector: 'alib-button-advance-title-example',
    templateUrl: './advance-title.component.html',
    standalone: true,
    imports: [AlibButtonModule, CommonModule]
})
export class AlibButtonAdvanceTitleExampleComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
