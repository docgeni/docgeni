import { Component, OnInit, Input, TemplateRef, HostBinding } from '@angular/core';

type LabelType = 'primary' | 'danger' | '';

@Component({
    selector: 'dg-label',
    templateUrl: './label.component.html'
})
export class LabelComponent implements OnInit {
    @HostBinding(`class`) classList: string[];

    @Input() set labelType(value: LabelType) {
        this.classList = ['dg-label', `dg-label-${value}`];
    }

    constructor() {}

    ngOnInit(): void {}
}
