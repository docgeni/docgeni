import { virtualFs } from '@angular-devkit/core';
import { DocgeniFsHostImpl } from '../fs';

export function createTestFsHost(files: Record<string, string>) {
    return new virtualFs.test.TestHost(files);
}

export function createTestFsSyncDelegateHost(files: Record<string, string>) {
    return new virtualFs.SyncDelegateHost(new virtualFs.test.TestHost(files));
}

export function createTestDocgeniFsHost(initialFiles: Record<string, string> = {}) {
    return new DocgeniFsHostImpl(new virtualFs.test.TestHost(initialFiles));
}
