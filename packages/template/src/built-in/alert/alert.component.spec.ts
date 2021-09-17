import { createComponentFactory, createHostFactory, Spectator } from '@ngneat/spectator';
import { DocgeniAlertComponent, DocgeniAlertType } from './alert.component';

describe('#built-in-alert', () => {
    describe('basic', () => {
        let spectator: Spectator<DocgeniAlertComponent>;
        const createComponent = createComponentFactory({
            component: DocgeniAlertComponent,
            imports: [],
            declarations: [DocgeniAlertComponent]
        });

        beforeEach(() => {
            spectator = createComponent();
        });

        it('should display default classes and content', () => {
            expect(spectator.element.classList.contains('dg-alert')).toBeTruthy();
            expect(spectator.element.classList.contains('dg-alert-info')).toBeTruthy();
            expect(spectator.element.innerHTML).toEqual('');
        });

        it('should set type success', () => {
            ['info', 'danger', 'warning', 'success'].forEach(type => {
                spectator.setInput('type', type as DocgeniAlertType);
                expect(spectator.element.classList.contains('dg-alert')).toBeTruthy();
                expect(spectator.element.classList.contains(`dg-alert-${type}`)).toBeTruthy();
            });
        });
    });

    describe('advance', () => {
        const createHost = createHostFactory({
            component: DocgeniAlertComponent
        });

        it('should set content success', () => {
            const spectator = createHost(`<alert type="info">Alert1</alert>`);
            expect(spectator.element.getAttribute('type')).toEqual(`info`);
            spectator.component.setAttribute('type', 'info');
            expect(spectator.element.innerHTML).toEqual(`Alert1`);
            expect(spectator.element.getAttribute('type')).toEqual(`info`);
        });
    });
});
