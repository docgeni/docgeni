import { Router } from '@angular/router';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { GlobalContext } from '../../services/global-context';
import { SearchService } from '../../services/search.service';
import { SearchComponent } from './search.component';

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
                },
            },
            {
                provide: SearchService,
                useValue: {
                    hasAlgolia: false,
                    result: [],
                    initSearch: vi.fn().mockName('initSearch'),
                    trackByFn: (
                        index: number,
                        item: {
                            id: string;
                        },
                    ) => item.id || index,
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

    it('should open results after typing', () => {
        spectator.focus('.search');
        spectator.typeInElement('intro', '.search');
        spectator.detectChanges();
        expect(getResultsContainer().classList.contains('is-searching')).toBe(true);
    });

    it('should open results after IME compositionend (Enter to confirm)', () => {
        spectator.focus('.search');
        const input = getInput();
        input.value = '介绍';
        input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true, isComposing: true }));
        input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '介绍' }));
        spectator.detectChanges();
        expect(spectator.component.searchText).toBe('介绍');
        expect(spectator.component.hasSearchText).toBe(true);
        expect(getResultsContainer().classList.contains('is-searching')).toBe(true);
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
        expect(spectator.component.searchText).toBe('介绍');
        expect(getResultsContainer().classList.contains('is-searching')).toBe(true);
    });

    it('should clear search on blur', () => {
        spectator.focus('.search');
        spectator.typeInElement('介绍', '.search');
        spectator.detectChanges();
        spectator.blur('.search');
        spectator.detectChanges();
        expect(spectator.component.searchText).toBe('');
        expect(spectator.component.isFocus).toBe(false);
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

        expect(spectator.component.searchText).toBe('');
        expect(spectator.component.isFocus).toBe(false);
        expect(spectator.inject(Router).navigateByUrl).toHaveBeenCalledWith('/guides/intro');
    });
});
