import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageTitleService } from '../../services/page-title.service';

@Component({
    selector: 'dg-example-isolated-viewer',
    templateUrl: './example.component.html',
    standalone: false,
})
export class ExampleIsolatedViewerComponent implements OnInit {
    public name = signal<string>('');
    private route = inject(ActivatedRoute);
    private pageTitle = inject(PageTitleService);

    constructor() {}

    ngOnInit(): void {
        this.name.set(this.route.snapshot.paramMap.get('name')!);
        this.pageTitle.title = `Example - ${this.name}`;
    }
}
