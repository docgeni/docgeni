import { PathFragment, virtualFs } from '@angular-devkit/core';
import { DocgeniFsHost, DocgeniFsHostImpl } from './docgeni-fs-host';
import { createTestDocgeniFsHost } from '../testing';

describe('#docgeni-host', () => {
    let host: DocgeniFsHost;

    beforeEach(() => {
        host = createTestDocgeniFsHost({
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

    it('should copy file exclude file', async () => {
        await host.copy('file1.txt', 'file100.txt', { exclude: 'file1.txt' });
        expect(await host.pathExists('file100.txt')).toEqual(false);
    });

    it('should copy folder success', async () => {
        await host.copy('folder', 'folder100');
        expect(await host.readFile('folder100/file1.txt')).toEqual('folder/file1.txt');
        expect(await host.readFile('folder100/file2.txt')).toEqual('folder/file2.txt');
        expect(await host.readFile('folder100/subfolder/file1.txt')).toEqual('folder/subfolder/file1.txt');
    });

    it('should copy folder exclude folder', async () => {
        await host.copy('folder', 'folder100', { exclude: 'folder' });
        expect(await host.pathExists('folder100/file1.txt')).toEqual(false);
        expect(await host.pathExists('folder100/file2.txt')).toEqual(false);
        expect(await host.pathExists('folder100/subfolder/file1.txt')).toEqual(false);
    });

    it('should get dirs success', async () => {
        const dirs = await host.getDirs('');
        expect(dirs).toEqual(['folder'] as PathFragment[]);
    });

    it('should get all dirs success', async () => {
        const dirs = await host.getDirs('', { recursively: true });
        expect(dirs).toEqual(['folder', 'folder/subfolder'] as PathFragment[]);
    });

    it('should get dirs exclude folder', async () => {
        const dirs = await host.getDirs('', { exclude: 'folder' });
        expect(dirs).toEqual([]);
    });

    it('should get dirs exclude folder', async () => {
        const dirs = await host.getDirs('', { exclude: 'subfolder', recursively: true });
        expect(dirs).toEqual(['folder']);
    });

    it('should get files success', async () => {
        const dirs = await host.getFiles('');
        expect(dirs).toEqual(['file1.txt', 'file2.txt']);
    });

    it('should get all files success', async () => {
        const dirs = await host.getFiles('', { recursively: true });
        expect(dirs).toEqual(['file1.txt', 'file2.txt', 'folder/file1.txt', 'folder/file2.txt', 'folder/subfolder/file1.txt']);
    });

    it('should get files exclude file1.txt', async () => {
        const dirs = await host.getFiles('', { exclude: 'file1.txt' });
        expect(dirs).toEqual(['file2.txt'] as PathFragment[]);
    });
});
