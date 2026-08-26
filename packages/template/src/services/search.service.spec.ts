import { fakeAsync, flush, tick } from '@angular/core/testing';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { GlobalContext } from './global-context';
import { SearchService } from './search.service';

describe('#SearchService', () => {
    let spectator: SpectatorService<SearchService>;
    let input: HTMLInputElement;
    const inputId = 'searchServiceSpecInput';
    const createService = createServiceFactory({
        service: SearchService,
        providers: [
            {
                provide: GlobalContext,
                useValue: {
                    locale: 'zh-cn',
                    config: {},
                    docItems: [
                        { id: 'intro', title: '介绍', path: 'guides/intro' },
                        { id: 'getting-started', title: 'Getting started', path: 'guides/intro/getting-started' },
                    ],
                },
            },
        ],
    });

    beforeEach(() => {
        input = document.createElement('input');
        input.id = inputId;
        document.body.appendChild(input);
        spectator = createService();
        spectator.service.initSearch(`#${inputId}`);
    });

    afterEach(() => {
        input.remove();
    });

    it('should search on input', fakeAsync(() => {
        input.value = 'Getting';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        tick(100);
        expect(spectator.service.result.length).toBe(1);
        expect(spectator.service.result[0].id).toBe('getting-started');
        flush();
    }));

    it('should not search while IME is composing', fakeAsync(() => {
        input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
        input.value = 'jieshao';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        tick(100);
        expect(spectator.service.result.length).toBe(0);

        input.value = '介绍';
        input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '介绍' }));
        expect(spectator.service.result.length).toBe(1);
        expect(spectator.service.result[0].id).toBe('intro');
        flush();
    }));

    it('should stop IME Enter from reaching bubble listeners', fakeAsync(() => {
        const bubbleSpy = jasmine.createSpy('keydown');
        input.addEventListener('keydown', bubbleSpy);

        input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true, isComposing: true }));
        expect(bubbleSpy).not.toHaveBeenCalled();

        input.value = '介绍';
        input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '介绍' }));
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
        expect(bubbleSpy).not.toHaveBeenCalled();
        flush();
    }));
});
