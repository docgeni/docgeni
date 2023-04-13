import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageTitleService } from '../../services/page-title.service';

@Component({
    selector: 'dg-example-isolated-viewer',
    templateUrl: './example.component.html'
})
export class ExampleIsolatedViewerComponent implements OnInit {
    public name!: string | null;

    constructor(private route: ActivatedRoute, private pageTitle: PageTitleService) {}

    ngOnInit(): void {
        this.name = this.route.snapshot.paramMap.get('name');
        this.pageTitle.title = `Example - ${this.name}`;
    }
}
