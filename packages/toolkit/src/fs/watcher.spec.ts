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

    linuxAndDarwinIt('watch files', async () => {
        const fsWatcher = new FileSystemWatcher();
        const content = virtualFs.stringToFileBuffer('new content');
        const file1Path = root + '/sub1/file1.txt';
        const file2Path = root + '/sub1/file2.txt';
        const file3Path = root + '/sub1/file3.txt';
        fs.mkdirSync(root + '/sub1');
        fs.writeFileSync(file1Path, 'hello world');
        fs.writeFileSync(file2Path, 'hello world');

        const allEvents: virtualFs.HostWatchEvent[] = [];
        fsWatcher.watch([file1Path, file2Path]).subscribe(change => {
            allEvents.push(change);
        });
        await toolkit.utils.wait(10);
        await host.write(normalize(file1Path), content).toPromise();
        await toolkit.utils.wait(10);
        await host.write(normalize(file3Path), content).toPromise();
        await toolkit.utils.wait(10);
        await host.delete(normalize(file2Path)).toPromise();
        await toolkit.utils.wait(2000);
        expect(allEvents.length).toEqual(2);
        await fsWatcher.close();
    });

    linuxAndDarwinIt('watch dir', async () => {
        const fsWatcher = new FileSystemWatcher();
        const content = virtualFs.stringToFileBuffer('hello world');
        const file1Path = root + '/sub1/file1.txt';
        const file2Path = root + '/sub1/file2.txt';
        const file3Path = root + '/sub1/sub2/file3.txt';
        fs.mkdirSync(root + '/sub1');
        fs.writeFileSync(file1Path, 'hello world');

        const allEvents: HostWatchEvent[] = [];
        fsWatcher.watch(root + '/sub1').subscribe(change => {
            allEvents.push(change);
        });
        await toolkit.utils.wait(10);
        await host.write(normalize(file2Path), content).toPromise();
        await toolkit.utils.wait(10);
        await host.write(normalize(file3Path), content).toPromise();
        await toolkit.utils.wait(10);
        await host.delete(normalize(file1Path)).toPromise();
        await toolkit.utils.wait(2000);
        expect(allEvents.length).toEqual(3);
        await fsWatcher.close();
    });

    linuxAndDarwinIt('watch aggregated', async () => {
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
        fsWatcher.aggregated(3000).subscribe(value => {
            allEvents = value;
        });
        await toolkit.utils.wait(10);
        await host.write(normalize(file1Path), content).toPromise();
        await toolkit.utils.wait(10);
        await host.write(normalize(file3Path), content).toPromise();
        await toolkit.utils.wait(10);
        await host.delete(normalize(file2Path)).toPromise();
        await toolkit.utils.wait(4000);
        expect(allEvents.length).toEqual(3);
        expect(allEvents[0].path).toEqual(normalize(file1Path));
        expect(allEvents[0].type).toEqual(HostWatchEventType.Changed);
        expect(allEvents[1].path).toEqual(normalize(file3Path));
        expect(allEvents[1].type).toEqual(HostWatchEventType.Created);
        expect(allEvents[2].path).toEqual(normalize(file2Path));
        expect(allEvents[2].type).toEqual(HostWatchEventType.Deleted);
        await fsWatcher.close();
    });
});
