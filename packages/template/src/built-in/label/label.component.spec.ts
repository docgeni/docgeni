import { createComponentFactory, createHostFactory, Spectator } from '@ngneat/spectator';
import { DocgeniLabelComponent, DocgeniLabelType } from './label.component';

describe('#built-in-label', () => {
    describe('basic', () => {
        let spectator: Spectator<DocgeniLabelComponent>;
        const createComponent = createComponentFactory({
            component: DocgeniLabelComponent,
            imports: [],
            declarations: [DocgeniLabelComponent]
        });

        beforeEach(() => {
            spectator = createComponent();
        });

        it('should display default classes and content', () => {
            expect(spectator.element.classList.contains('dg-label')).toBeTruthy();
            expect(spectator.element.classList.contains('dg-label-primary')).toBeTruthy();
            expect(spectator.element.innerHTML).toEqual('');
        });

        it('should set type success', () => {
            ['info', 'danger', 'warning', 'primary'].forEach(type => {
                spectator.setInput('type', type as DocgeniLabelType);
                expect(spectator.element.classList.contains('dg-label')).toBeTruthy();
                expect(spectator.element.classList.contains(`dg-label-${type}`)).toBeTruthy();
            });
        });
    });

    describe('advance', () => {
        const createHost = createHostFactory({
            component: DocgeniLabelComponent
        });

        it('should set content success', () => {
            const spectator = createHost(`<label type="primary">Label1</label>`);
            expect(spectator.element.getAttribute('type')).toEqual(`primary`);
            spectator.component.setAttribute('type', 'primary');
            expect(spectator.element.innerHTML).toEqual(`Label1`);
            expect(spectator.element.getAttribute('type')).toEqual(`primary`);
        });
    });
});
