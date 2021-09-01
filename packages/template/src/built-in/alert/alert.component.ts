import { Component, ElementRef, OnInit } from '@angular/core';
import { DocgeniBuiltInComponent } from '../built-in-component';

@Component({
    selector: 'dg-alert',
    templateUrl: './alert.component.html'
})
export class DocgeniAlertComponent extends DocgeniBuiltInComponent implements OnInit {
    constructor(elementRef: ElementRef<unknown>) {
        super(elementRef);
    }

    ngOnInit(): void {}
}

export default {
    selector: 'dg-alert',
    component: DocgeniAlertComponent
};
