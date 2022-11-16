import { getTSSystemPath, normalizeSlashes } from './path';

describe('#path', () => {
    describe('#normalizeSlashes', () => {
        it('should normalize slashes', () => {
            expect(normalizeSlashes('a')).toEqual('a');
            expect(normalizeSlashes('a/b')).toEqual('a/b');
            expect(normalizeSlashes('a\\b')).toEqual('a/b');
            expect(normalizeSlashes('\\\\server\\path')).toEqual('//server/path');
            expect(normalizeSlashes(`D:\\a\\docgeni`)).toEqual('D:/a/docgeni');
            // expect(normalizeSlashes(`D:\\a\docgeni`)).toEqual('D:/a/docgeni');
        });
    });

    describe('#getTSSystemPath', () => {
        it('should getTSSystemPath', () => {
            expect(getTSSystemPath('a')).toEqual('a');
            expect(normalizeSlashes('a/b')).toEqual('a/b');
            expect(normalizeSlashes('a\\b')).toEqual('a/b');
            expect(normalizeSlashes('\\\\server\\path')).toEqual('//server/path');
            expect(normalizeSlashes(`D:\\a\\docgeni`)).toEqual('D:/a/docgeni');
        });
    });

});
