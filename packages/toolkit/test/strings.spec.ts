import { toolkit } from '../src';
import * as path from 'path';
import { expect } from 'chai';

describe('#toolkit.string', () => {
    beforeEach(() => {});

    it('should been plural when word is books ', () => {
        const result = toolkit.strings.isPlural('books');
        expect(result).eq(true);
    });

    it('should not been plural when word is book ', () => {
        const result = toolkit.strings.isPlural('book');
        expect(result).eq(false);
    });

    it('should been singular when word is books ', () => {
        const result = toolkit.strings.isSingular('books');
        expect(result).eq(false);
    });

    it('should not been plural when word is book ', () => {
        const result = toolkit.strings.isSingular('book');
        expect(result).eq(true);
    });
});
