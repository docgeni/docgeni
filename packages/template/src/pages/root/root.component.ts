import { Component } from '@angular/core';

@Component({
    selector: 'doc-root',
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.scss']
})
export class DocRootComponent {
    title = '首页';

    constructor() {}
}
