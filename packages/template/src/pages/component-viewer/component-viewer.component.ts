import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-component-viewer',
    templateUrl: './component-viewer.component.html',
    styleUrls: ['./component-viewer.component.scss']
})
export class ComponentViewerComponent implements OnInit {
    name = '';

    constructor() {}

    ngOnInit(): void {}
}
