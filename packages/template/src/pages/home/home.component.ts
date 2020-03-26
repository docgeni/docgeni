import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../services';

@Component({
    selector: 'doc-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class DocHomeComponent implements OnInit {
    constructor(public config: ConfigService) {}

    ngOnInit(): void {}
}
