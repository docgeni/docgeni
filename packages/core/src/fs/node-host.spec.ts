import { DocgeniNodeJsAsyncHost } from './node-host';
import { normalize, virtualFs } from '@angular-devkit/core';
import { NodeJsAsyncHost } from '@angular-devkit/core/node';
import fs from 'fs';
import temp from 'temp';
import { Observable, Subscription } from 'rxjs';
import { linuxAndDarwinIt, linuxOnlyIt } from '../testing';

describe('DocgeniNodeJsAsyncHost', () => {
    let root: string;
    let host: virtualFs.Host<fs.Stats>;

    beforeEach(() => {
        root = temp.mkdirSync('core-node-spec-');
        host = new virtualFs.ScopedHost(new DocgeniNodeJsAsyncHost(), normalize(root));
    });

    afterEach(done =>
        host
            .delete(normalize('/'))
            .toPromise()
            .then(done, done.fail)
    );

    it('should get correct result for exists', async () => {
        let isExists = await host.exists(normalize('not-found')).toPromise();
        expect(isExists).toBe(false);
        await host.write(normalize('not-found'), virtualFs.stringToFileBuffer('content')).toPromise();
        isExists = await host.exists(normalize('not-found')).toPromise();
        expect(isExists).toBe(true);
    });

    linuxAndDarwinIt('watch', done => {
        let obs: Observable<virtualFs.HostWatchEvent>;
        let subscription: Subscription;
        const content = virtualFs.stringToFileBuffer('hello world');
        const content2 = virtualFs.stringToFileBuffer('hello world 2');
        const allEvents: virtualFs.HostWatchEvent[] = [];

        Promise.resolve()
            .then(() => fs.mkdirSync(root + '/sub1'))
            .then(() => fs.writeFileSync(root + '/sub1/file1', 'hello world'))
            .then(() => {
                obs = host.watch(normalize('/sub1'), { recursive: true })!;
                expect(obs).not.toBeNull();
                subscription = obs.subscribe(event => {
                    allEvents.push(event);
                });
            })
            // eslint-disable-next-line no-restricted-globals
            .then(() => new Promise(resolve => setTimeout(resolve, 10)))
            // Discard the events registered so far.
            .then(() => allEvents.splice(0))
            .then(() => host.write(normalize('/sub1/sub2/file3'), content).toPromise())
            .then(() => host.write(normalize('/sub1/file2'), content2).toPromise())
            .then(() => host.delete(normalize('/sub1/file1')).toPromise())
            // eslint-disable-next-line no-restricted-globals
            .then(() => new Promise(resolve => setTimeout(resolve, 1000)))
            .then(() => {
                expect(allEvents.length).toBe(3);
                subscription.unsubscribe();
            })
            .then(done, done.fail);
    });
});
