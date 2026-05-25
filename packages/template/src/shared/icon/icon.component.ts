import { Component, OnInit, Input, AfterViewInit, ElementRef, HostBinding } from '@angular/core';
import { BUILTIN_SVGS } from './svgs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'dg-icon',
    templateUrl: './icon.component.html',
})
export class IconComponent implements OnInit, AfterViewInit {
    @HostBinding('class.dg-icon') isIcon = true;

    @Input() set iconName(name: string) {
        this.setSvg(name);
    }

    constructor(
        private elementRef: ElementRef<HTMLElement>,
        private domSanitizer: DomSanitizer,
    ) {}

    ngOnInit(): void {}

    ngAfterViewInit() {}

    setSvg(name: string) {
        const svg = BUILTIN_SVGS[name];
        if (svg) {
            this.elementRef.nativeElement.innerHTML = svg;
        } else {
            this.elementRef.nativeElement.innerHTML = '';
        }
    }
}
