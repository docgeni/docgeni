import { DocgeniNodeJsAsyncHost } from './node-host';
import { normalize, virtualFs } from '@angular-devkit/core';
import { NodeJsAsyncHost } from '@angular-devkit/core/node';
import fs from 'fs';
import temp from 'temp';

describe('DocgeniNodeJsAsyncHost', () => {
    let root: string;
    let host: virtualFs.Host<fs.Stats>;

    beforeEach(() => {
        root = temp.mkdirSync('core-node-spec-');
        host = new virtualFs.ScopedHost(new DocgeniNodeJsAsyncHost(), normalize(root));
    });

    afterEach(done =>
        host
            .delete(normalize('/'))
            .toPromise()
            .then(done, done.fail)
    );

    it('should get correct result for exists', async () => {
        let isExists = await host.exists(normalize('not-found')).toPromise();
        expect(isExists).toBe(false);
        await host.write(normalize('not-found'), virtualFs.stringToFileBuffer('content')).toPromise();
        isExists = await host.exists(normalize('not-found')).toPromise();
        expect(isExists).toBe(true);
    });
});
