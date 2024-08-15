import { virtualFs } from '@angular-devkit/core';
import { DocgeniFsHostImpl } from '../fs';
import { normalize } from '../path';
import { lastValueFrom } from 'rxjs';

class TestDocgeniFsHostImpl extends DocgeniFsHostImpl {
    async copyFile(src: string, dest: string): Promise<void> {
        const data = await lastValueFrom(this.host.read(normalize(src)));
        await lastValueFrom(this.host.write(normalize(dest), data));
    }
}

export function createTestFsHost(files: Record<string, string>) {
    return new virtualFs.test.TestHost(files);
}

export function createTestFsSyncDelegateHost(files: Record<string, string>) {
    return new virtualFs.SyncDelegateHost(new virtualFs.test.TestHost(files));
}

export function createTestDocgeniFsHost(initialFiles: Record<string, string> = {}) {
    return new TestDocgeniFsHostImpl(new virtualFs.test.TestHost(initialFiles));
}
