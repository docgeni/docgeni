import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'alib-button-advance-example',
    templateUrl: './advance.component.html'
})
export class AlibButtonAdvanceExampleComponent implements OnInit {
    loading = false;

    constructor() {}

    ngOnInit(): void {}

    toggleLoading() {
        this.loading = !this.loading;
    }
}
