import { Component, AfterViewInit, OnDestroy, inject, ChangeDetectionStrategy, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { SearchPageInfo, SearchService } from '../../services/search.service';
import { IconComponent } from '../icon/icon.component';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../pipes/translate.pipe';
import { HighlightPipe } from '../pipes/highlight.pipe';

/** IME "Process" key reported by some browsers while composing CJK text. */
const IME_PROCESS_KEY_CODE = 229;

@Component({
    selector: 'dg-search',
    templateUrl: './search.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [IconComponent, FormsModule, TranslatePipe, HighlightPipe],
})
export class SearchComponent implements AfterViewInit, OnDestroy {
    searchService = inject(SearchService);
    private router = inject(Router);

    readonly searchText = signal('');

    readonly isFocus = signal(false);

    private readonly composing = signal(false);

    /** Suppress a trailing Enter that some browsers emit right after compositionend. */
    private suppressEnter = false;

    private suppressEnterTimer: ReturnType<typeof setTimeout> | null = null;

    readonly hasSearchText = computed(() => !!this.searchText().trim());

    constructor() {
        effect(() => {
            const keywords = this.searchText();
            if (this.composing() || this.searchService.hasAlgolia) {
                return;
            }
            this.searchService.search(keywords);
        });
    }

    ngAfterViewInit() {
        this.searchService.initSearch('#inputSearch');
    }

    ngOnDestroy() {
        this.clearSuppressEnterTimer();
    }

    focus() {
        this.isFocus.set(true);
    }

    blur() {
        if (this.composing()) {
            return;
        }
        this.reset();
    }

    onCompositionStart() {
        this.composing.set(true);
    }

    onCompositionEnd(event: CompositionEvent) {
        this.searchText.set((event.target as HTMLInputElement | null)?.value ?? '');
        this.isFocus.set(true);
        this.composing.set(false);
        // Firefox/Safari may emit a real Enter keydown after compositionend.
        this.suppressEnter = true;
        this.clearSuppressEnterTimer();
        // eslint-disable-next-line no-restricted-globals
        this.suppressEnterTimer = setTimeout(() => {
            this.suppressEnterTimer = null;
            this.suppressEnter = false;
        }, 0);
    }

    onKeydown(event: KeyboardEvent) {
        if (event.key !== 'Enter') {
            return;
        }
        if (this.composing() || this.suppressEnter || event.isComposing || event.keyCode === IME_PROCESS_KEY_CODE) {
            return;
        }
        event.preventDefault();
        this.isFocus.set(true);
    }

    toRoute($event: Event, item: SearchPageInfo) {
        if (!item.path.startsWith('http')) {
            $event.preventDefault();
            this.router.navigateByUrl(item.path);
        }
        this.reset();
    }

    private reset() {
        this.isFocus.set(false);
        this.searchText.set('');
    }

    private clearSuppressEnterTimer() {
        if (this.suppressEnterTimer) {
            clearTimeout(this.suppressEnterTimer);
            this.suppressEnterTimer = null;
        }
    }
}
