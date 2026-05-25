import { Component, HostListener, input, Input, OnInit } from '@angular/core';
import { CopierService } from '../copier/copier.service';
import { IconComponent } from '../icon/icon.component';
@Component({
    selector: 'dg-copy,[dgCopy]',
    templateUrl: './copy.component.html',
    host: {
        class: 'dg-copy',
    },
    imports: [IconComponent],
})
export class CopyComponent implements OnInit {
    public icon = 'copy';

    public readonly dgCopy = input<string>('');

    constructor(private copier: CopierService) {}

    ngOnInit(): void {}

    @HostListener('click', ['$event'])
    copy($event: Event) {
        this.copier.copyText(this.dgCopy());
        this.icon = 'check';
        /* eslint-disable no-restricted-globals */
        setTimeout(() => {
            this.icon = 'copy';
        }, 2000);
    }
}
