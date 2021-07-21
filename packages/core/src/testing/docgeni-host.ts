import { virtualFs } from '@angular-devkit/core';
import { DocgeniHostImpl } from '../docgeni-host';

export function createTestDocgeniHost(host?: virtualFs.Host) {
    return new DocgeniHostImpl(host || new virtualFs.test.TestHost());
}
