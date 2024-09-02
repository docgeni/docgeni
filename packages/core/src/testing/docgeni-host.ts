import { virtualFs } from '@angular-devkit/core';
import { fs, strings } from '@docgeni/toolkit';

export async function assertExpectedFiles(host: fs.DocgeniFsHost, expectedFiles: Record<string, string>, normalize = false) {
    for (const filePath of Object.keys(expectedFiles)) {
        const content = await host.readFile(filePath);
        if (expectedFiles[filePath]) {
            if (normalize) {
                expect(strings.compatibleNormalize(content)).toEqual(strings.compatibleNormalize(expectedFiles[filePath]));
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
