import { virtualFs } from '@angular-devkit/core';
import { DocgeniHost, DocgeniHostImpl } from '../docgeni-host';

export function createTestDocgeniHost(initialFiles: Record<string, string> = {}) {
    return new DocgeniHostImpl(new virtualFs.test.TestHost(initialFiles));
}

export async function assertExpectedFiles(host: DocgeniHost, expectedFiles: Record<string, string>) {
    for (const filePath of Object.keys(expectedFiles)) {
        const content = await host.readFile(filePath);
        if (expectedFiles[filePath]) {
            expect(content).toEqual(expectedFiles[filePath]);
        }
    }
}
