import { Component, ElementRef, HostBinding, Input, OnInit } from '@angular/core';
import { DocgeniBuiltInComponent } from '@docgeni/template';

@Component({
    selector: 'my-color',
    templateUrl: './color.component.html'
})
export class MyColorComponent extends DocgeniBuiltInComponent implements OnInit {
    @Input() set color(value: string) {
        this.hostElement.style.color = value;
    }

    constructor(elementRef: ElementRef<unknown>) {
        super(elementRef);
    }

    ngOnInit(): void {}
}

// export default {
//     selector: 'my-color',
//     component: MyColorComponent
// };
