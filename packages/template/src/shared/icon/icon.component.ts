import { Component, OnInit, Input, AfterViewInit, ElementRef, HostBinding, inject } from '@angular/core';
import { BUILTIN_SVGS } from './svgs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'dg-icon',
    templateUrl: './icon.component.html',
    host: {
        class: 'dg-icon',
    },
})
export class IconComponent implements OnInit, AfterViewInit {
    private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
    private domSanitizer = inject(DomSanitizer);

    @Input() set iconName(name: string) {
        this.setSvg(name);
    }

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
