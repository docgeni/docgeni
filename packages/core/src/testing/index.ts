import { toolkit } from '@docgeni/toolkit';
import { expect } from 'chai';

export * from './docgeni-host';
export * from './docgeni-context';
export * from './fixture-loader';
export * from './ng-parser-spectator';

export async function expectThrowAsync(method: any, errorMessage: string | Error) {
    let error = null;
    try {
        await method();
    } catch (err) {
        error = err;
    }
    if (toolkit.utils.isString(errorMessage)) {
        expect(error).to.be.an('Error');
        if (errorMessage) {
            expect(error.message).to.equal(errorMessage, `${error.stack}`);
        }
    } else {
        expect(error.message).to.equal(errorMessage.message, `${error.stack}`);
    }
}

// TODO: replace this with an "it()" macro that's reusable globally.
let linuxOnlyIt: typeof it = it;
let linuxAndDarwinIt: typeof it = it;
if (process.platform.startsWith('win') || process.platform.startsWith('darwin')) {
    linuxOnlyIt = xit;
}
if (process.platform.startsWith('win')) {
    linuxAndDarwinIt = xit;
}

export { linuxOnlyIt, linuxAndDarwinIt };
