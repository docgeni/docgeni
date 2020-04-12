import { toolkit, Print } from '../src';
import * as path from 'path';
import { expect } from 'chai';
import * as TypeMoq from 'typemoq';

describe('#toolkit.print', () => {
    beforeEach(() => {});

    it('should been plural when word is books ', () => {
        const mock: TypeMoq.IMock<Console> = TypeMoq.Mock.ofInstance<Console>(console, TypeMoq.MockBehavior.Strict, true);
        toolkit.print.debug('debug');
        mock.reset();
        // toolkit.print.nativeInfo('books', 'sdd');
        // toolkit.print.info('info', 'info2', { name: 2 });
        // toolkit.print.warn('warn');
        // toolkit.print.debug('debug');
        // toolkit.print.error('error');
        // toolkit.print.succuss('succuss');
    });
});
