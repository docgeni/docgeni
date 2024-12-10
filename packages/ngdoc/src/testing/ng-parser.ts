import { createTestFsSyncDelegateHost } from '@docgeni/toolkit/src/testing';
import { fs, toolkit } from '@docgeni/toolkit';
import { Path, virtualFs } from '@angular-devkit/core';
import { NgDocParser } from '../ng-parser';
import { createNgParserHost } from '../ng-parser-host';

export function createTestNgParserFsHost(files: Record<string, string>) {
    const host = createTestFsSyncDelegateHost(files);

    function readDirectory(
        rootDir: string,
        extensions: readonly string[],
        excludes: readonly string[] | undefined,
        includes: readonly string[],
        depth?: number,
    ) {
        const list = host.list(rootDir as Path);
        const result: string[] = [];
        list.forEach((item) => {
            const itemPath = `${rootDir}/${item}`;
            if (host.isDirectory(itemPath as Path)) {
                const files = readDirectory(itemPath, extensions, excludes, includes, depth);
                if (files.length > 0) {
                    result.push(...files);
                }
            } else if (item.endsWith('.ts')) {
                result.push(itemPath);
            }
        });

        return result;
    }

    return {
        fileExists: (path: string) => {
            return host.exists(path as Path);
        },
        readFile: (path: string) => {
            if (host.exists(path as Path)) {
                return virtualFs.fileBufferToString(host.read(path as Path));
            } else {
                return toolkit.fs.readFileSync(path, { encoding: 'utf-8' });
            }
        },
        writeFile: (path: string, data: string, writeByteOrderMark?: boolean) => {
            host.write(path as Path, virtualFs.stringToFileBuffer(data));
        },
        readDirectory: readDirectory,
    };
}

export function createTestNgParserHost(component: string, files: Record<string, string>) {
    const fsHost = createTestNgParserFsHost(files);
    const ngParserHost = createNgParserHost({
        fsHost: fsHost,
    });
    return {
        ngParserHost,
        fsHost,
    };
}

export function createTestNgDocParser(
    component: string,
    files: Record<string, string>,
    options: { sypGlobSync: boolean } = { sypGlobSync: true },
) {
    if (options && options.sypGlobSync) {
        spyGlobSync(Object.keys(files));
    }
    const { ngParserHost, fsHost } = createTestNgParserHost(component, files);
    const ngDocParser = new NgDocParser({
        ngParserHost: ngParserHost,
    });
    return {
        ngDocParser,
        ngParserHost,
        fsHost,
    };
}

export function spyGlobSync(files: string[]) {
    const globSyncSpy = spyOn(toolkit.fs, 'globSync');
    globSyncSpy.and.returnValue(files);
}
