import { DocgeniNodeJsAsyncHost } from './node-host';
import { normalize, virtualFs } from '@angular-devkit/core';
import { NodeJsAsyncHost } from '@angular-devkit/core/node';
import fs from 'fs';
import temp from 'temp';
import { linuxAndDarwinIt, linuxOnlyIt } from '../testing';
import * as utils from '../utils';

describe('DocgeniNodeJsAsyncHost', () => {
    let root: string;
    let host: DocgeniNodeJsAsyncHost;

    beforeEach(() => {
        root = temp.mkdirSync('core-node-spec-');
        host = new DocgeniNodeJsAsyncHost();
    });

    afterEach(async () => {
        await host.delete(normalize(root)).toPromise();
    });

    it('should get correct result for exists', async () => {
        let isExists = await host.exists(normalize(root + '/not-found')).toPromise();
        expect(isExists).toBe(false);
        await host.write(normalize(root + '/not-found'), virtualFs.stringToFileBuffer('content')).toPromise();
        isExists = await host.exists(normalize(root + '/not-found')).toPromise();
        expect(isExists).toBe(true);
    });

    linuxAndDarwinIt(
        'watch',
        async function () {
            const content = virtualFs.stringToFileBuffer('hello world');
            const content2 = virtualFs.stringToFileBuffer('hello world 2');
            const allEvents: virtualFs.HostWatchEvent[] = [];

            const file1Path = root + '/sub1/file1.txt';
            const file2Path = root + '/sub1/file2.txt';
            const file3Path = root + '/sub1/sub2/file3.txt';

            fs.mkdirSync(root + '/sub1');
            fs.writeFileSync(file1Path, 'hello world');
            const obs = host.watch(root + '/sub1', { recursive: true, ignoreInitial: true })!;
            expect(obs).not.toBeNull();
            const subscription = obs.subscribe((event) => {
                allEvents.push(event);
            });
            await utils.wait(200);
            await host.write(normalize(file3Path), content).toPromise();
            await utils.wait(200);
            await host.write(normalize(file2Path), content2).toPromise();
            await utils.wait(200);
            await host.delete(normalize(file1Path)).toPromise();
            await utils.wait(5000);
            expect(allEvents.length).toBeGreaterThanOrEqual(3);
            const pathStr = (p: any) => (typeof p === 'string' ? p : String(p)).replace(/\\/g, '/');
            const hasFile3Add = allEvents.some(
                (e) => pathStr(e.path).includes('file3.txt') && e.type === virtualFs.HostWatchEventType.Created,
            );
            const hasFile2 = allEvents.some(
                (e) =>
                    pathStr(e.path).includes('file2.txt') &&
                    (e.type === virtualFs.HostWatchEventType.Changed || e.type === virtualFs.HostWatchEventType.Created),
            );
            const hasFile1Delete = allEvents.some(
                (e) => pathStr(e.path).includes('file1.txt') && e.type === virtualFs.HostWatchEventType.Deleted,
            );
            expect(hasFile3Add && hasFile2 && hasFile1Delete).toBe(true);
            subscription.unsubscribe();
        },
        20000,
    );
});
