import { kits } from '../src';
import * as path from 'path';
import { expect } from 'chai';

describe('#kits.string', () => {
    beforeEach(() => {});

    it('should been plural when word is books ', () => {
        const result = kits.strings.isPlural('books');
        expect(result).eq(true);
    });

    it('should not been plural when word is book ', () => {
        const result = kits.strings.isPlural('book');
        expect(result).eq(false);
    });

    it('should been singular when word is books ', () => {
        const result = kits.strings.isSingular('books');
        expect(result).eq(false);
    });

    it('should not been plural when word is book ', () => {
        const result = kits.strings.isSingular('book');
        expect(result).eq(true);
    });
});
