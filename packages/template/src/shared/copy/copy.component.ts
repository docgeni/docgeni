import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CopierService } from '../copier/copier.service';

@Component({
    selector: 'dg-copy,[dgCopy]',
    templateUrl: './copy.component.html',
    host: {
        class: 'dg-copy'
    }
})
export class CopyComponent implements OnInit {
    public icon = 'copy';

    @Input() text: string;

    @Input('dgCopy') set dgCopy(text: string) {
        this.text = text;
    }

    constructor(private copier: CopierService) {}

    ngOnInit(): void {}

    @HostListener('click', ['$event'])
    copy($event: Event) {
        this.copier.copyText(this.text);
        this.icon = 'check';
        /* eslint-disable no-restricted-globals */
        setTimeout(() => {
            this.icon = 'copy';
        }, 2000);
    }
}
