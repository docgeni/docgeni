import { virtualFs } from '@angular-devkit/core';
import { DocgeniHost, DocgeniHostImpl } from './docgeni-host';
import { createTestDocgeniHost } from './testing';

describe('#docgeni-host', () => {
    let testHost: virtualFs.test.TestHost;
    let host: DocgeniHost;

    beforeEach(() => {
        host = createTestDocgeniHost({
            'file1.txt': 'file1 content',
            'file2.txt': 'file2 content',
            'folder/file1.txt': 'folder/file1.txt',
            'folder/file2.txt': 'folder/file2.txt',
            'folder/subfolder/file1.txt': 'folder/subfolder/file1.txt'
        });
    });

    it('should read file success', async () => {
        expect(await host.readFile('file1.txt')).toEqual('file1 content');
    });

    it('should write file success', async () => {
        await host.writeFile('file100.txt', 'file100 content');
        expect(await host.readFile('file100.txt')).toEqual('file100 content');
    });

    it('should copy file success', async () => {
        await host.copy('file1.txt', 'file100.txt');
        expect(await host.readFile('file100.txt')).toEqual('file1 content');
    });

    it('should copy folder success', async () => {
        await host.copy('folder', 'folder100');
        expect(await host.readFile('folder100/file1.txt')).toEqual('folder/file1.txt');
        expect(await host.readFile('folder100/file2.txt')).toEqual('folder/file2.txt');
        expect(await host.readFile('folder100/subfolder/file1.txt')).toEqual('folder/subfolder/file1.txt');
    });
});
