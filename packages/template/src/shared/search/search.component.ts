import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchPageInfo, SearchService } from '../../services/search.service';

@Component({
    selector: 'dg-search',
    templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit, AfterViewInit {
    public searchText!: string;

    public isFocus!: boolean;

    public hasSearchText!: boolean;

    constructor(public searchService: SearchService, private router: Router) {}

    ngOnInit(): void {}

    ngAfterViewInit() {
        this.searchService.initSearch('#inputSearch');
    }

    focus() {
        this.isFocus = true;
    }

    blur() {
        // eslint-disable-next-line no-restricted-globals
        setTimeout(() => {
            this.isFocus = false;
            this.searchText = '';
            this.hasSearchText = false;
        }, 200);
    }

    change() {
        // eslint-disable-next-line no-restricted-globals
        setTimeout(() => {
            this.hasSearchText = !!this.searchText?.trim();
        }, 200);
    }

    toRoute($event: Event, item: SearchPageInfo) {
        if (!item.path.startsWith('http')) {
            $event.preventDefault();
            this.router.navigateByUrl(item.path);
        }
    }
}
