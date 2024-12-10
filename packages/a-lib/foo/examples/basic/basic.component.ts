import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AlibFooModule } from '@docgeni/alib/foo';

/**
 * @title Foo Basic
 * @order 1
 */
@Component({
    selector: 'alib-foo-basic-example',
    templateUrl: './basic.component.html',
    styleUrls: ['./basic.component.scss'],
    standalone: true,
    imports: [AlibFooModule, CommonModule],
})
export class AlibFooBasicExampleComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
