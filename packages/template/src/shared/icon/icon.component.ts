import { Component, OnInit, Input, ViewChildren, TemplateRef, AfterViewInit, ElementRef, HostBinding } from '@angular/core';
import { BUILTIN_SVGS } from './svgs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
    selector: 'dg-icon',
    templateUrl: './icon.component.html'
})
export class IconComponent implements OnInit, AfterViewInit {
    @Input() iconName: string;

    @HostBinding('class.dg-icon') isIcon = true;

    svg: string;

    svgHTML: SafeHtml;
    constructor(private elementRef: ElementRef<HTMLElement>, private domSanitizer: DomSanitizer) {}

    ngOnInit(): void {
        this.svg = BUILTIN_SVGS[this.iconName];
        if (this.svg) {
            this.elementRef.nativeElement.innerHTML = this.svg;
        }
    }

    ngAfterViewInit() {}
}
