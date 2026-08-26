import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { GlobalContext } from './global-context';
import { SearchService } from './search.service';

describe('#SearchService', () => {
    beforeEach(() => {
        vi.useFakeTimers({ advanceTimeDelta: 1, shouldAdvanceTime: true });
    });
    afterEach(() => {
        vi.useRealTimers();
    });
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

    it('should search on input', async () => {
        input.value = 'Getting';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        await vi.advanceTimersByTimeAsync(100);
        expect(spectator.service.result.length).toBe(1);
        expect(spectator.service.result[0].id).toBe('getting-started');
        await vi.runAllTimersAsync();
    });

    it('should not search while IME is composing', async () => {
        input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
        input.value = 'jieshao';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        await vi.advanceTimersByTimeAsync(100);
        expect(spectator.service.result.length).toBe(0);

        input.value = '介绍';
        input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '介绍' }));
        expect(spectator.service.result.length).toBe(1);
        expect(spectator.service.result[0].id).toBe('intro');
        await vi.runAllTimersAsync();
    });

    it('should stop IME Enter from reaching bubble listeners', async () => {
        const bubbleSpy = vi.fn().mockName('keydown');
        input.addEventListener('keydown', bubbleSpy);

        input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true, isComposing: true }));
        expect(bubbleSpy).not.toHaveBeenCalled();

        input.value = '介绍';
        input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '介绍' }));
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
        expect(bubbleSpy).not.toHaveBeenCalled();
        await vi.runAllTimersAsync();
    });
});
