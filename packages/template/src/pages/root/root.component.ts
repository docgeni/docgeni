import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalContext } from '../../services';

@Component({
    selector: 'dg-root',
    templateUrl: './root.component.html'
})
export class RootComponent {
    @HostBinding(`class.dg-main`) isMain = true;

    constructor() {}
}
