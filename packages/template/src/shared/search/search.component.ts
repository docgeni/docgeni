import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SearchPageInfo, SearchService } from '../../services/search.service';
import { IconComponent } from '../icon/icon.component';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../pipes/translate.pipe';
import { HighlightPipe } from '../pipes/highlight.pipe';

@Component({
    selector: 'dg-search',
    templateUrl: './search.component.html',
    imports: [IconComponent, FormsModule, TranslatePipe, HighlightPipe],
})
export class SearchComponent implements OnInit, AfterViewInit {
    searchService = inject(SearchService);
    private router = inject(Router);

    public searchText!: string;

    public isFocus!: boolean;

    public hasSearchText!: boolean;

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
