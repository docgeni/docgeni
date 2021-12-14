import { NgParserHost, createNgParserHost } from './ng-parser-host';
import path from 'path';

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

    fit('should create default NgParserHost with watch', () => {
        const tsConfigPath = path.resolve(fixtureRootDir, './tsconfig.json');
        console.log(`fixtureRootDir: ${fixtureRootDir}`);
        const parserHost = createNgParserHost({
            tsConfigPath: tsConfigPath,
            watch: true,
            rootDir: fixtureRootDir,
            watcher: (event, filename) => {}
        });
        expect(parserHost).toBeTruthy();
        expect(parserHost.program).toBeTruthy();

        const sourceFiles = parserHost.program.getSourceFiles();
        expect(sourceFiles).toBeTruthy();
        expect(sourceFiles.length > 0).toBeTruthy();
    });
});
