import { kits, Print } from '../src';
import * as path from 'path';
import { expect } from 'chai';
import * as TypeMoq from 'typemoq';

describe('#kits.print', () => {
    beforeEach(() => {});

    it('should been plural when word is books ', () => {
        const mock: TypeMoq.IMock<Console> = TypeMoq.Mock.ofInstance<Console>(console, TypeMoq.MockBehavior.Strict, true);
        kits.print.debug('debug');
        mock.reset();
        // kits.print.nativeInfo('books', 'sdd');
        // kits.print.info('info', 'info2', { name: 2 });
        // kits.print.warn('warn');
        // kits.print.debug('debug');
        // kits.print.error('error');
        // kits.print.succuss('succuss');
    });
});
