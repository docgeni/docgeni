import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService, DocItem, NavigationItem } from '../../services';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'doc-component-viewer',
    templateUrl: './component-viewer.component.html'
})
export class DocComponentViewerComponent implements OnInit {
    @Input() docItem: DocItem;

    constructor() {}

    ngOnInit(): void {}
}
