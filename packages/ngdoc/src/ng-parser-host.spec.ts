import { NgParserHost, createNgParserHost } from './ng-parser-host';
import path from 'path';
import { ts } from './typescript';
import { toolkit } from '@docgeni/toolkit';

describe('#ng-parser-host', () => {
    const fixtureRootDir = path.resolve(__dirname, '../test/fixtures/tsconfig');

    it('should create default NgParserHost success', () => {
        const tsConfigPath = path.resolve(fixtureRootDir, './tsconfig.json');
        const parserHost = createNgParserHost({
            tsConfigPath: tsConfigPath
        });
        expect(parserHost).toBeTruthy();
        expect(parserHost.program).toBeTruthy();

        const sourceFiles = parserHost.program.getSourceFiles();
        expect(sourceFiles).toBeTruthy();
        expect(sourceFiles.length > 0).toBeTruthy();
    });

    it('should create default NgParserHost with watch', () => {
        const tsConfigPath = path.resolve(fixtureRootDir, './tsconfig.json');
        const watchSpy = spyOn(toolkit.fs, 'watch');
        const parserHost = createNgParserHost({
            tsConfigPath: tsConfigPath,
            watch: true,
            rootDir: fixtureRootDir,
            watcher: (event, filename) => {}
        });
        expect(parserHost).toBeTruthy();
        expect(parserHost.program).toBeTruthy();
        expect(watchSpy).toHaveBeenCalledTimes(2);

        const allArgs = watchSpy.calls.allArgs();
        expect(allArgs[0][0]).toEqual(toolkit.utils.normalizeSlashes(`${fixtureRootDir}/src/button.component.ts`));
        expect(allArgs[0][1]).toEqual({ persistent: true });
        expect(allArgs[1][0]).toEqual(toolkit.utils.normalizeSlashes(`${fixtureRootDir}/src/public-api.ts`));
        expect(allArgs[1][1]).toEqual({ persistent: true });
        const sourceFiles = parserHost.program.getSourceFiles();
        expect(sourceFiles).toBeTruthy();
        expect(sourceFiles.length > 0).toBeTruthy();
    });
});
