import { createTestFsSyncDelegateHost } from '@docgeni/toolkit/src/testing';
import { fs, toolkit } from '@docgeni/toolkit';
import { Path, virtualFs } from '@angular-devkit/core';
import { NgDocParser } from '../ng-parser';
import { createNgParserHost } from '../ng-parser-host';

export function createTestNgParserFsHost(files: Record<string, string>) {
    const host = createTestFsSyncDelegateHost(files);
    return {
        fileExists: (path: string) => {
            return host.exists(path as Path);
        },
        readFile: (path: string) => {
            return virtualFs.fileBufferToString(host.read(path as Path));
        },
        writeFile: (path: string, data: string, writeByteOrderMark?: boolean) => {
            host.write(path as Path, virtualFs.stringToFileBuffer(data));
        },
        readDirectory: (
            rootDir: string,
            extensions: readonly string[],
            excludes: readonly string[] | undefined,
            includes: readonly string[],
            depth?: number
        ) => {
            return [] as string[];
        }
    };
}

export function createTestNgParserHost(component: string, files: Record<string, string>) {
    const fsHost = createTestNgParserFsHost(files);
    const ngParserHost = createNgParserHost({
        fsHost: fsHost
    });
    return {
        ngParserHost,
        fsHost
    };
}

export function createTestNgDocParser(component: string, files: Record<string, string>) {
    const { ngParserHost, fsHost } = createTestNgParserHost(component, files);
    const ngDocParser = new NgDocParser({
        ngParserHost: ngParserHost
    });
    return {
        ngDocParser,
        ngParserHost,
        fsHost
    };
}
