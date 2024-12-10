import { toolkit, Print } from '../src';
import * as path from 'path';
import { expect } from 'chai';

describe('#toolkit.fs', () => {
    const basicPath = path.resolve(__dirname, './fixtures/dir-basic');
    beforeEach(() => {});

    describe('getDirsAndFiles', () => {
        it(`should get all dir and files ['a', 'b', 'c.js']`, async () => {
            const dirAndFiles = await toolkit.fs.getDirsAndFiles(basicPath);
            expect(dirAndFiles).deep.equals(['a', 'b', 'c.js']);
        });

        it(`should get dirs and files exclude a`, async () => {
            const dirAndFiles = await toolkit.fs.getDirsAndFiles(basicPath, {
                exclude: 'a',
            });
            expect(dirAndFiles).deep.equals(['b', 'c.js']);
        });

        it(`should get dirs and files exclude a and c.js`, async () => {
            const dirAndFiles = await toolkit.fs.getDirsAndFiles(basicPath, {
                exclude: ['a', 'c.js'],
            });
            expect(dirAndFiles).deep.equals(['b']);
        });

        it(`should get empty exclude *`, async () => {
            const dirAndFiles = await toolkit.fs.getDirsAndFiles(basicPath, {
                exclude: '*',
            });
            expect(dirAndFiles).deep.equals([]);
        });

        it(`should only get dirs exclude *.js`, async () => {
            const dirAndFiles = await toolkit.fs.getDirsAndFiles(basicPath, {
                exclude: '*.js',
            });
            expect(dirAndFiles).deep.equals(['a', 'b']);
        });
    });

    describe('getDirs', () => {
        it(`should get all dir ['a', 'b']`, async () => {
            const dirAndFiles = await toolkit.fs.getDirs(basicPath);
            expect(dirAndFiles).deep.equals(['a', 'b']);
        });

        it(`should get dirs exclude a`, async () => {
            const dirAndFiles = await toolkit.fs.getDirs(basicPath, {
                exclude: 'a',
            });
            expect(dirAndFiles).deep.equals(['b']);
        });

        it(`should get empty exclude *`, async () => {
            const dirAndFiles = await toolkit.fs.getDirs(basicPath, {
                exclude: '*',
            });
            expect(dirAndFiles).deep.equals([]);
        });

        it(`should only get dirs exclude ['a', 'b']`, async () => {
            const dirAndFiles = await toolkit.fs.getDirs(basicPath, {
                exclude: ['a', 'b'],
            });
            expect(dirAndFiles).deep.equals([]);
        });
    });
});
