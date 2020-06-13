import { toolkit } from '../src';
import * as path from 'path';
import { expect } from 'chai';

describe('#toolkit.string', () => {
    beforeEach(() => {});

    describe('isPlural', () => {
        it('should been plural when word is books ', () => {
            const result = toolkit.strings.isPlural('books');
            expect(result).eq(true);
        });

        it('should not been plural when word is book ', () => {
            const result = toolkit.strings.isPlural('book');
            expect(result).eq(false);
        });
    });

    describe('isSingular', () => {
        it('should been singular when word is books ', () => {
            const result = toolkit.strings.isSingular('books');
            expect(result).eq(false);
        });

        it('should not been plural when word is book ', () => {
            const result = toolkit.strings.isSingular('book');
            expect(result).eq(true);
        });
    });

    describe('snakeCase', () => {
        it('hello world => hello_world', () => {
            const result = toolkit.strings.snakeCase('hello world');
            expect(result).eq('hello_world');
        });

        it('basic.component.ts => basic_component_ts', () => {
            const result = toolkit.strings.snakeCase('basic.component.ts');
            expect(result).eq('basic_component_ts');
        });
    });

    describe('paramCase', () => {
        it('hello world => hello-world', () => {
            const result = toolkit.strings.paramCase('hello world');
            expect(result).eq('hello-world');
        });

        it('basic.component.ts => basic-component-ts', () => {
            const result = toolkit.strings.paramCase('basic-component-ts');
            expect(result).eq('basic-component-ts');
        });
    });

    describe('titleCase', () => {
        it('hello world => Hello World', () => {
            const result = toolkit.strings.titleCase('hello world');
            expect(result).eq('Hello World');
        });

        it('basic.component.ts => Basic Component Ts', () => {
            const result = toolkit.strings.titleCase('basic.component.ts');
            expect(result).eq('basic.component.ts');
        });
    });

    describe('headerCase', () => {
        it('hello world => Hello World', () => {
            const result = toolkit.strings.headerCase('hello world');
            expect(result).eq('Hello-World');
        });

        it('should get Hello World with delimiter is " "', () => {
            const result = toolkit.strings.headerCase('hello world', {
                delimiter: ' '
            });
            expect(result).eq('Hello World');
        });
    });
});
