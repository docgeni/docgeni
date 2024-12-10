import { NgParserHost, createNgParserHost } from './ng-parser-host';
import path from 'path';
import { ts } from './typescript';
import { toolkit } from '@docgeni/toolkit';
import { createTestNgParserFsHost } from './testing';

describe('#ng-parser-host', () => {
    const fixtureRootDir = toolkit.path.resolve(__dirname, '../test/fixtures/tsconfig');

    it('should create default NgParserHost success', () => {
        const tsConfigPath = toolkit.path.resolve(fixtureRootDir, './tsconfig.json');
        const parserHost = createNgParserHost({
            tsConfigPath: tsConfigPath,
        });
        expect(parserHost).toBeTruthy();
        expect(parserHost.program).toBeTruthy();

        const sourceFiles = parserHost.program.getSourceFiles();
        expect(sourceFiles).toBeTruthy();
        const publicAPISourceFilePath = toolkit.path.getTSSystemPath(toolkit.path.resolve(fixtureRootDir, 'src/public-api.ts'));
        const buttonSourceFilePath = toolkit.path.getTSSystemPath(toolkit.path.resolve(fixtureRootDir, 'src/button/button.component.ts'));
        const publicAPISourceFile = sourceFiles.find((sourceFile) => {
            return sourceFile.fileName === publicAPISourceFilePath;
        });
        const buttonSourceFile = sourceFiles.find((sourceFile) => {
            return sourceFile.fileName === buttonSourceFilePath;
        });
        expect(publicAPISourceFile).toBeTruthy();
        expect(buttonSourceFile).toBeTruthy();
        expect(sourceFiles.length > 0).toBeTruthy();
    });

    it('should getSourceFileByPath', () => {
        const tsConfigPath = toolkit.path.resolve(fixtureRootDir, './tsconfig.json');
        const parserHost = createNgParserHost({
            tsConfigPath: tsConfigPath,
        });
        const buttonPath = toolkit.path.getSystemPath(toolkit.path.resolve(fixtureRootDir, 'src/button/*.ts'));
        const filePaths = toolkit.fs.globSync(buttonPath);
        expect(filePaths.length).toBeGreaterThanOrEqual(1);
        const filePath = filePaths[0];
        const finalPath = ts.sys.useCaseSensitiveFileNames ? filePath : filePath.toLowerCase();
        const sourceFile = parserHost.program.getSourceFileByPath(finalPath as ts.Path);
        expect(sourceFile).toBeTruthy();
    });

    it('should create default NgParserHost with watch', () => {
        const tsConfigPath = toolkit.path.resolve(fixtureRootDir, './tsconfig.json');
        const watchSpy = spyOn(toolkit.fs, 'watch');
        const parserHost = createNgParserHost({
            tsConfigPath: tsConfigPath,
            watch: true,
            rootDir: fixtureRootDir,
            watcher: (event, filename) => {},
        });
        expect(parserHost).toBeTruthy();
        expect(parserHost.program).toBeTruthy();
        expect(watchSpy).toHaveBeenCalledTimes(2);

        const allArgs = watchSpy.calls.allArgs();
        expect(allArgs[1][0]).toEqual(toolkit.utils.getTSSystemPath(`${fixtureRootDir}/src/button/button.component.ts`));
        expect(allArgs[1][1]).toEqual({ persistent: true });
        expect(allArgs[0][0]).toEqual(toolkit.utils.getTSSystemPath(`${fixtureRootDir}/src/public-api.ts`));
        expect(allArgs[0][1]).toEqual({ persistent: true });
        const sourceFiles = parserHost.program.getSourceFiles();
        expect(sourceFiles).toBeTruthy();
        expect(sourceFiles.length > 0).toBeTruthy();
    });

    it('should cache latest content when trigger multiple changes', async () => {
        const tsConfigPath = toolkit.path.resolve(fixtureRootDir, './tsconfig.json');
        const watchSpy = spyOn(toolkit.fs, 'watch');
        const allFiles = toolkit.fs.globSync(`${fixtureRootDir}/**/*.{ts,json}`);
        const fileContents: Record<string, string> = {};
        for (const filePath of allFiles) {
            fileContents[filePath] = await toolkit.fs.readFileContent(filePath);
        }
        const parserHostWatcherSpy = jasmine.createSpy('parserHostWatcherSpy');
        const parserHost = createNgParserHost({
            tsConfigPath: tsConfigPath,
            watch: true,
            rootDir: fixtureRootDir,
            watcher: parserHostWatcherSpy,
        });
        expect(parserHost).toBeTruthy();
        expect(parserHost.program).toBeTruthy();
        expect(watchSpy).toHaveBeenCalledTimes(2);
        const allArgs = watchSpy.calls.allArgs();
        const watchCallbackFn = allArgs[1][2];
        const compPath = toolkit.utils.getTSSystemPath(`${fixtureRootDir}/src/button/button.component.ts`);

        expect(parserHostWatcherSpy).not.toHaveBeenCalled();
        watchCallbackFn!('change', compPath);
        expect(parserHostWatcherSpy).not.toHaveBeenCalled();
    });
});
