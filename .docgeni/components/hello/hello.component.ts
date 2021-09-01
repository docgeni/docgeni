import { Component, ElementRef, HostBinding, Input, OnInit } from '@angular/core';
import { DocgeniBuiltInComponent } from '@docgeni/template';

type LabelType = 'primary' | 'danger' | 'warning' | 'info' | '';

@Component({
    selector: 'my-hello',
    templateUrl: './hello.component.html'
})
export class MyHelloComponent extends DocgeniBuiltInComponent implements OnInit {
    @HostBinding(`class`) classList: string[];

    constructor(elementRef: ElementRef<unknown>) {
        super(elementRef);
    }

    ngOnInit(): void {}
}

export default {
    selector: 'my-hello',
    component: MyHelloComponent
};
