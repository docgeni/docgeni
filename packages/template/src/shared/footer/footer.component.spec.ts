import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { GlobalContext } from '../../services/global-context';
import { FooterComponent } from './footer.component';

describe('#footer', () => {
    let spectator: Spectator<FooterComponent>;
    const createComponent = createComponentFactory({
        component: FooterComponent,
        providers: [
            {
                provide: GlobalContext,
                useValue: {
                    config: {
                        footer: 'My Footer Content',
                    },
                },
            },
        ],
    });

    it('should get correct footer', () => {
        spectator = createComponent();
        expect(spectator.element.classList.contains('dg-footer')).toBeTruthy();
        expect(spectator.element.classList.contains('dg-hidden')).toBeFalsy();
        expect(spectator.element.textContent).toContain('My Footer Content');
    });

    it('should hidden footer when footer is empty', () => {
        spectator = createComponent({
            providers: [
                {
                    provide: GlobalContext,
                    useValue: {
                        config: {
                            footer: undefined,
                        },
                    },
                },
            ],
        });
        expect(spectator.element.classList.contains('dg-footer')).toBeTruthy();
        expect(spectator.element.classList.contains('dg-hidden')).toBeTruthy();
        expect(spectator.element.textContent).toBeFalsy();
    });
});
