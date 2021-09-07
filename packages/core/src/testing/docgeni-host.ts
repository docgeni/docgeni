import { virtualFs } from '@angular-devkit/core';
import { DocgeniHostImpl } from '../docgeni-host';

export function createTestDocgeniHost(initialFiles: Record<string, string> = {}) {
    return new DocgeniHostImpl(new virtualFs.test.TestHost(initialFiles) as any);
}
