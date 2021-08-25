import { Component, OnInit, Input, TemplateRef, HostBinding, ElementRef, Renderer2 } from '@angular/core';
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
        const { r, g, b } = this.getColorRgb(color);
        return `rgba(${r},${g},${b},0.1)`;
    }

    private getColorRgb(color: string) {
        let obj: { r: number; g: number; b: number };
        if (color.startsWith('#')) {
            obj = this.getHexColorRgb(color);
        } else if (color.startsWith('rgb')) {
            obj = this.getRgbColorRgb(color);
        }
        return obj;
    }

    private getHexColorRgb(color: any) {
        const rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        const hex = color.replace(rgx, (m: any, r: any, g: any, b: any) => r + r + g + g + b + b);
        const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return { r: parseInt(rgb[1], 16), g: parseInt(rgb[2], 16), b: parseInt(rgb[3], 16) };
    }

    private getRgbColorRgb(color: string) {
        const result = /rgb\(([0-9]{1,3})\s*[,\s]\s*([0-9]{1,3})\s*[,\s]\s*([0-9]{1,3})\)/.exec(color);
        return {
            r: parseInt(result[1], 10),
            g: parseInt(result[2], 10),
            b: parseInt(result[3], 10)
        };
    }
}
