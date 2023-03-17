import { virtualFs } from '@angular-devkit/core';
import { fs } from '@docgeni/toolkit';
import { compatibleNormalize } from '../markdown';

export function createTestDocgeniHost(initialFiles: Record<string, string> = {}) {
    return new fs.DocgeniFsHostImpl(new virtualFs.test.TestHost(initialFiles));
}

export async function assertExpectedFiles(host: fs.DocgeniFsHost, expectedFiles: Record<string, string>, normalize = false) {
    for (const filePath of Object.keys(expectedFiles)) {
        const content = await host.readFile(filePath);
        if (expectedFiles[filePath]) {
            if (normalize) {
                expect(compatibleNormalize(content)).toEqual(compatibleNormalize(expectedFiles[filePath]));
            } else {
                expect(content).toEqual(expectedFiles[filePath]);
            }
        }
    }
}

export async function writeFilesToHost(host: fs.DocgeniFsHost, files: Record<string, string>) {
    for (const key in files) {
        if (Object.prototype.hasOwnProperty.call(files, key)) {
            await host.writeFile(key, files[key]);
        }
    }
}
