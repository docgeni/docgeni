import { Component, OnInit, Input, TemplateRef, HostBinding, ElementRef, Renderer2 } from '@angular/core';
import { colorMetadata } from '@docgeni/template/utils/color-metadata';
type LabelType = 'primary' | 'danger' | 'warning' | 'info' | '';
const LABEL_LIST = ['primary', 'danger', 'warning', 'info'];
@Component({
    selector: 'dg-label',
    templateUrl: './label.component.html'
})
export class LabelComponent implements OnInit {
    @HostBinding(`class`) classList: string[];

    @Input() set labelType(value: LabelType) {
        if (LABEL_LIST.includes(value)) {
            this.classList = ['dg-label', `dg-label-${value}`];
        } else {
            this.classList = ['dg-label'];
            this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', this.getBackgroundColor(value));
            this.renderer.setStyle(this.elementRef.nativeElement, 'color', value);
        }
    }

    constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

    ngOnInit(): void {}

    private getBackgroundColor(color: string) {
        const { r, g, b } = colorMetadata(color);
        return `rgba(${r},${g},${b},0.30)`;
    }
}
