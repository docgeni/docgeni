import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlibButtonModule } from '@docgeni/alib/button';

@Component({
    selector: 'alib-button-advance-example',
    templateUrl: './advance.component.html',
    standalone: true,
    imports: [AlibButtonModule, CommonModule],
})
export class AlibButtonAdvanceExampleComponent implements OnInit {
    loading = false;

    constructor() {}

    ngOnInit(): void {}

    toggleLoading() {
        this.loading = !this.loading;
    }
}
