import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { createComponentFactory, createHostFactory, Spectator, SpectatorHost, createHttpFactory } from '@ngneat/spectator';
import { ContentViewerComponent } from './content-viewer.component';
import { DocgeniBuiltInComponent } from '../../built-in/built-in-component';
import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { setBuiltInComponents } from '../../built-in/built-in-components';
import { CONFIG_TOKEN } from '../../services/global-context';

@Component({
    selector: 'my-label',
    changeDetection: ChangeDetectionStrategy.Eager,
    template: 'my-label <ng-content></ng-content>',
})
class MyLabelComponent extends DocgeniBuiltInComponent {
    readonly type = input.required<string>();
}

setBuiltInComponents([
    {
        selector: 'my-label',
        component: MyLabelComponent,
    },
]);

describe('#content-viewer', () => {
    let spectator: Spectator<ContentViewerComponent>;
    const createComponent = createComponentFactory({
        component: ContentViewerComponent,
        imports: [MyLabelComponent],
        providers: [
            {
                provide: CONFIG_TOKEN,
                useValue: {
                    defaultLocale: 'zh-cn',
                },
            },
            provideHttpClient(withXhr(), withInterceptorsFromDi()),
            provideHttpClientTesting(),
        ],
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

    it('should emit contentRendered when fetch content success by url', async () => {
        vi.useFakeTimers();
        const url = '/test';
        const httpTestingController = spectator.inject(HttpTestingController);
        spectator.setInput('url', url);
        const contentRenderedSpy = vi.fn().mockName('contentRendered spy');
        spectator.output('contentRendered').subscribe(contentRenderedSpy);
        const req = httpTestingController.expectOne(url);
        expect(req.request.method).toEqual('GET');
        expect(req.request.responseType).toEqual('text');
        req.flush('<div>content</div>');
        await vi.runAllTimersAsync();
        httpTestingController.verify();
        expect(contentRenderedSpy).toHaveBeenCalled();
        expect(contentRenderedSpy).toHaveBeenCalledWith(spectator.element);
        vi.useRealTimers();
    });

    it('should display error content fetch content fail', () => {
        const url = '/test';
        const httpTestingController = spectator.inject(HttpTestingController);
        spectator.setInput('url', url);
        const req = httpTestingController.expectOne(url);
        expect(req.request.method).toEqual('GET');
        expect(req.request.responseType).toEqual('text');
        const error = new Error(`fetch url ${url} fail`);
        req.error(new ErrorEvent('request', { error: error }), {
            statusText: "remote content can't been load",
        });
        httpTestingController.verify();
        expect(spectator.element.textContent).toEqual(`Failed to load document: /test. Error: remote content can't been load`);
    });

    it('should render built-in component success', async () => {
        const url = '/test';
        const httpTestingController = spectator.inject(HttpTestingController);
        spectator.setInput('url', url);
        const req = httpTestingController.expectOne(url);
        expect(req.request.method).toEqual('GET');
        req.flush('<div><my-label type="primary">label1</my-label></div>');
        httpTestingController.verify();
        expect(spectator.element.innerHTML).toEqual('<div><my-label type="primary">my-label label1</my-label></div>');
    });
});
