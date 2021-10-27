import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SearchService } from '../../services/search.service';

@Component({
    selector: 'dg-search',
    templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit, AfterViewInit {
    public searchText: string;

    public isFocus: boolean;

    public hasSearchText: boolean;

    constructor(public searchService: SearchService) {}

    ngOnInit(): void {}

    ngAfterViewInit() {
        this.searchService.initSearch('#inputSearch');
    }

    focus() {
        this.isFocus = true;
    }

    blur() {
        this.isFocus = false;
        // eslint-disable-next-line no-restricted-globals
        setTimeout(() => {
            this.searchText = '';
            this.hasSearchText = false;
        });
    }

    change() {
        // eslint-disable-next-line no-restricted-globals
        setTimeout(() => {
            this.hasSearchText = !!this.searchText?.trim();
        }, 100);
    }
}
