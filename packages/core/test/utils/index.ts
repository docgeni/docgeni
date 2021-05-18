import { toolkit } from '@docgeni/toolkit';
import { expect } from 'chai';

export * from './docgeni-host';

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
