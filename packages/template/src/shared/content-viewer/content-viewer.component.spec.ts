import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { createComponentFactory, createHostFactory, Spectator, SpectatorHost, createHttpFactory } from '@ngneat/spectator';
import { ContentViewerComponent } from './content-viewer.component';
import { DocgeniBuiltInComponent } from '../../built-in/built-in-component';
import { Component, ElementRef, Input, NgZone } from '@angular/core';
import { setBuiltInComponents } from '../../built-in/built-in-components';
import { CONFIG_TOKEN } from '../../services/global-context';

@Component({
    selector: 'my-label',
    template: 'my-label <ng-content></ng-content>'
})
class MyLabelComponent extends DocgeniBuiltInComponent {
    @Input() type!: string;

    constructor(elementRef: ElementRef<unknown>) {
        super(elementRef);
    }
}

setBuiltInComponents([
    {
        selector: 'my-label',
        component: MyLabelComponent
    }
]);

describe('#content-viewer', () => {
    let spectator: Spectator<ContentViewerComponent>;
    const createComponent = createComponentFactory({
        component: ContentViewerComponent,
        imports: [HttpClientTestingModule],
        providers: [
            {
                provide: CONFIG_TOKEN,
                useValue: {
                    defaultLocale: 'zh-cn'
                }
            }
        ],
        declarations: [MyLabelComponent]
    });

    beforeEach(() => {
        spectator = createComponent();
    });

    it('should display content fetch content success by url', () => {
        const url = '/test';
        const httpTestingController = spectator.inject(HttpTestingController);
        spectator.setInput('url', url);
        const req = httpTestingController.expectOne(url);
        expect(req.request.method).toEqual('GET');
        expect(req.request.responseType).toEqual('text');
        req.flush('<div>content</div>');
        httpTestingController.verify();
        expect(spectator.element.innerHTML).toEqual('<div>content</div>');
    });

    it('should emit contentRendered when fetch content success by url', fakeAsync(() => {
        const url = '/test';
        const httpTestingController = spectator.inject(HttpTestingController);
        spectator.setInput('url', url);
        const contentRenderedSpy = jasmine.createSpy('contentRendered spy');
        spectator.output('contentRendered').subscribe(contentRenderedSpy);
        const req = httpTestingController.expectOne(url);
        expect(req.request.method).toEqual('GET');
        expect(req.request.responseType).toEqual('text');
        req.flush('<div>content</div>');
        httpTestingController.verify();
        expect(contentRenderedSpy).not.toHaveBeenCalled();
        spectator.inject(NgZone).onStable.next(null);
        expect(contentRenderedSpy).toHaveBeenCalled();
        expect(contentRenderedSpy).toHaveBeenCalledWith(spectator.element);
    }));

    it('should display error content fetch content fail', () => {
        const url = '/test';
        const httpTestingController = spectator.inject(HttpTestingController);
        spectator.setInput('url', url);
        const req = httpTestingController.expectOne(url);
        expect(req.request.method).toEqual('GET');
        expect(req.request.responseType).toEqual('text');
        const error = new Error(`fetch url ${url} fail`);
        req.error(new ErrorEvent('request', { error: error }), {
            statusText: "remote content can't been load"
        });
        httpTestingController.verify();
        expect(spectator.element.innerHTML).toEqual(`Failed to load document: /test. Error: remote content can't been load`);
    });

    it('should render built-in component success', fakeAsync(() => {
        const url = '/test';
        const httpTestingController = spectator.inject(HttpTestingController);
        spectator.setInput('url', url);
        const req = httpTestingController.expectOne(url);
        expect(req.request.method).toEqual('GET');
        req.flush('<div><my-label type="primary">label1</my-label></div>');
        httpTestingController.verify();
        expect(spectator.element.innerHTML).toEqual('<div><my-label type="primary">my-label label1</my-label></div>');
    }));
});
