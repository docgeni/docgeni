import { virtualFs } from '@angular-devkit/core';
import temp from 'temp';
import fs from 'fs';
import { DocgeniNodeJsAsyncHost } from './node-host';
import { normalize, resolve } from '../path';
import { FileSystemWatcher, HostWatchEvent, HostWatchEventType } from './watcher';
import { toolkit } from '@docgeni/toolkit';
import { linuxAndDarwinIt } from '../testing';

describe('#fs-watcher', () => {
    let root: string;
    let host: virtualFs.Host<fs.Stats>;

    beforeEach(() => {
        root = temp.mkdirSync('core-node-spec-');
        host = new DocgeniNodeJsAsyncHost();
    });

    afterEach(async () => {
        await host.delete(normalize(root)).toPromise();
    });

    linuxAndDarwinIt(
        'watch files',
        async function () {
            const fsWatcher = new FileSystemWatcher();
            const content = virtualFs.stringToFileBuffer('new content');
            const file1Path = root + '/sub1/file1.txt';
            const file2Path = root + '/sub1/file2.txt';
            const file3Path = root + '/sub1/file3.txt';
            fs.mkdirSync(root + '/sub1');
            fs.writeFileSync(file1Path, 'hello world');
            fs.writeFileSync(file2Path, 'hello world');

            const allEvents: virtualFs.HostWatchEvent[] = [];
            fsWatcher.watch([file1Path, file2Path]).subscribe((change) => {
                allEvents.push(change);
            });
            await toolkit.utils.wait(300);
            await host.write(normalize(file1Path), content).toPromise();
            await toolkit.utils.wait(200);
            await host.write(normalize(file3Path), content).toPromise();
            await toolkit.utils.wait(200);
            await host.delete(normalize(file2Path)).toPromise();
            await toolkit.utils.wait(5000);
            expect(allEvents.length).toBeGreaterThanOrEqual(2);
            const hasFile1Change = allEvents.some(
                (e) => normalize(e.path) === normalize(file1Path) && e.type === HostWatchEventType.Changed,
            );
            const hasFile2Delete = allEvents.some(
                (e) => normalize(e.path) === normalize(file2Path) && e.type === HostWatchEventType.Deleted,
            );
            expect(hasFile1Change && hasFile2Delete).toBe(true);
            await fsWatcher.close();
        },
        20000,
    );

    linuxAndDarwinIt(
        'watch dir',
        async function () {
            const fsWatcher = new FileSystemWatcher();
            const content = virtualFs.stringToFileBuffer('hello world');
            const file1Path = root + '/sub1/file1.txt';
            const file2Path = root + '/sub1/file2.txt';
            const file3Path = root + '/sub1/sub2/file3.txt';
            fs.mkdirSync(root + '/sub1');
            fs.writeFileSync(file1Path, 'hello world');

            const allEvents: HostWatchEvent[] = [];
            fsWatcher.watch(root + '/sub1').subscribe((change) => {
                allEvents.push(change);
            });
            await toolkit.utils.wait(300);
            await host.write(normalize(file2Path), content).toPromise();
            await toolkit.utils.wait(200);
            await host.write(normalize(file3Path), content).toPromise();
            await toolkit.utils.wait(200);
            await host.delete(normalize(file1Path)).toPromise();
            await toolkit.utils.wait(5000);
            expect(allEvents.length).toBeGreaterThanOrEqual(3);
            const hasFile2Add = allEvents.some((e) => normalize(e.path) === normalize(file2Path) && e.type === HostWatchEventType.Created);
            const hasFile3Add = allEvents.some((e) => normalize(e.path) === normalize(file3Path) && e.type === HostWatchEventType.Created);
            const hasFile1Delete = allEvents.some(
                (e) => normalize(e.path) === normalize(file1Path) && e.type === HostWatchEventType.Deleted,
            );
            expect(hasFile2Add && hasFile3Add && hasFile1Delete).toBe(true);
            await fsWatcher.close();
        },
        20000,
    );

    linuxAndDarwinIt(
        'watch aggregated',
        async function () {
            const fsWatcher = new FileSystemWatcher();
            const content = virtualFs.stringToFileBuffer('new content');
            const file1Path = root + '/sub1/file1.txt';
            const file2Path = root + '/sub1/file2.txt';
            const file3Path = root + '/sub1/file3.txt';
            fs.mkdirSync(root + '/sub1');
            fs.writeFileSync(file1Path, 'hello world');
            fs.writeFileSync(file2Path, 'hello world');

            let allEvents: HostWatchEvent[] = [];
            fsWatcher.watch(root + '/sub1');
            fsWatcher.aggregated(3000).subscribe((value) => {
                allEvents = value;
            });
            await toolkit.utils.wait(300);
            await host.write(normalize(file1Path), content).toPromise();
            await toolkit.utils.wait(200);
            await host.write(normalize(file3Path), content).toPromise();
            await toolkit.utils.wait(200);
            await host.delete(normalize(file2Path)).toPromise();
            await toolkit.utils.wait(6000);
            expect(allEvents.length).toBeGreaterThanOrEqual(3);
            const hasFile1Change = allEvents.some(
                (e) => normalize(e.path) === normalize(file1Path) && e.type === HostWatchEventType.Changed,
            );
            const hasFile3Add = allEvents.some((e) => normalize(e.path) === normalize(file3Path) && e.type === HostWatchEventType.Created);
            const hasFile2Delete = allEvents.some(
                (e) => normalize(e.path) === normalize(file2Path) && e.type === HostWatchEventType.Deleted,
            );
            expect(hasFile1Change && hasFile3Add && hasFile2Delete).toBe(true);
            await fsWatcher.close();
        },
        20000,
    );
});
