import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

/**
 * @title Baz Basic
 * @order 1
 */
@Component({
    selector: 'alib-bar-basic-example',
    templateUrl: './basic.component.html',
    styleUrls: ['./basic.component.scss'],
    standalone: false,
})
export class AlibBarBasicExampleComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
