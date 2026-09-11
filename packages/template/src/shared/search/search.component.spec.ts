import { Router } from '@angular/router';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { GlobalContext } from '../../services/global-context';
import { SearchService } from '../../services/search.service';
import { SearchComponent } from './search.component';

const docItems = [
    { id: 'intro', title: '介绍', path: 'guides/intro' },
    { id: 'getting-started', title: 'Getting started', path: 'guides/intro/getting-started' },
];

describe('#search', () => {
    beforeEach(() => {
        vi.useFakeTimers({ advanceTimeDelta: 1, shouldAdvanceTime: true });
    });
    afterEach(() => {
        vi.useRealTimers();
    });
    let spectator: Spectator<SearchComponent>;
    const createComponent = createComponentFactory({
        component: SearchComponent,
        providers: [
            {
                provide: GlobalContext,
                useValue: {
                    locale: 'zh-cn',
                    config: {},
                    docItems,
                },
            },
            {
                provide: Router,
                useValue: {
                    navigateByUrl: vi.fn().mockName('navigateByUrl'),
                },
            },
        ],
    });

    beforeEach(() => {
        spectator = createComponent();
    });

    function getInput() {
        return spectator.query('.search') as HTMLInputElement;
    }

    function getResultsContainer() {
        return spectator.query('.search-results-container') as HTMLElement;
    }

    function resultIds() {
        return spectator
            .inject(SearchService)
            .result()
            .map((item) => item.id);
    }

    it('should open results after typing', () => {
        spectator.focus('.search');
        spectator.typeInElement('intro', '.search');
        spectator.detectChanges();
        expect(getResultsContainer().classList.contains('is-searching')).toBe(true);
    });

    it('should filter results immediately for English input', () => {
        spectator.focus('.search');
        spectator.typeInElement('Getting', '.search');
        spectator.detectChanges();
        expect(resultIds()).toEqual(['getting-started']);
        expect(getResultsContainer().querySelectorAll('.search-result').length).toBe(1);
    });

    it('should open results after IME compositionend (Enter to confirm)', () => {
        spectator.focus('.search');
        const input = getInput();
        input.value = '介绍';
        input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true, isComposing: true }));
        input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '介绍' }));
        spectator.detectChanges();
        expect(spectator.component.searchText()).toBe('介绍');
        expect(spectator.component.hasSearchText()).toBe(true);
        expect(getResultsContainer().classList.contains('is-searching')).toBe(true);
        expect(resultIds()).toEqual(['intro']);
    });

    it('should not search pinyin while IME is composing', () => {
        spectator.focus('.search');
        const input = getInput();
        input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
        spectator.typeInElement('Getting', '.search');
        spectator.detectChanges();
        expect(resultIds()).toEqual([]);

        input.value = '介绍';
        input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '介绍' }));
        spectator.detectChanges();
        expect(resultIds()).toEqual(['intro']);
    });

    it('should keep results open when a trailing Enter is fired after compositionend', async () => {
        spectator.focus('.search');
        const input = getInput();
        input.value = '介绍';
        input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
        input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '介绍' }));
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
        spectator.detectChanges();
        expect(getResultsContainer().classList.contains('is-searching')).toBe(true);
        await vi.runAllTimersAsync();
    });

    it('should prevent default on results mousedown to keep input focus', () => {
        spectator.focus('.search');
        spectator.typeInElement('介绍', '.search');
        spectator.detectChanges();

        const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
        const prevented = !getResultsContainer().dispatchEvent(event);
        expect(prevented || event.defaultPrevented).toBe(true);
        expect(spectator.component.searchText()).toBe('介绍');
        expect(getResultsContainer().classList.contains('is-searching')).toBe(true);
    });

    it('should clear search on blur', () => {
        spectator.focus('.search');
        spectator.typeInElement('介绍', '.search');
        spectator.detectChanges();
        spectator.blur('.search');
        spectator.detectChanges();
        expect(spectator.component.searchText()).toBe('');
        expect(spectator.component.isFocus()).toBe(false);
        expect(resultIds()).toEqual([]);
    });

    it('should clear search after selecting a result', () => {
        spectator.focus('.search');
        spectator.typeInElement('介绍', '.search');
        spectator.detectChanges();

        spectator.component.toRoute(new Event('click'), {
            id: 'intro',
            title: '介绍',
            path: '/guides/intro',
        });
        spectator.detectChanges();

        expect(spectator.component.searchText()).toBe('');
        expect(spectator.component.isFocus()).toBe(false);
        expect(spectator.inject(Router).navigateByUrl).toHaveBeenCalledWith('/guides/intro');
        expect(resultIds()).toEqual([]);
        expect(getResultsContainer().classList.contains('is-searching')).toBe(false);
    });

    it('should reopen results when typing after selecting a result without refocusing', () => {
        spectator.focus('.search');
        spectator.typeInElement('介绍', '.search');
        spectator.detectChanges();

        spectator.component.toRoute(new Event('click'), {
            id: 'intro',
            title: '介绍',
            path: '/guides/intro',
        });
        spectator.detectChanges();

        spectator.typeInElement('Getting', '.search');
        spectator.detectChanges();

        expect(spectator.component.isFocus()).toBe(true);
        expect(resultIds()).toEqual(['getting-started']);
        expect(getResultsContainer().classList.contains('is-searching')).toBe(true);
    });
});
