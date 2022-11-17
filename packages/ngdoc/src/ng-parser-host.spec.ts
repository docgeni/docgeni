import { NgParserHost, createNgParserHost } from './ng-parser-host';
import path from 'path';
import { ts } from './typescript';
import { toolkit } from '@docgeni/toolkit';

describe('#ng-parser-host', () => {
    const fixtureRootDir = toolkit.path.resolve(__dirname, '../test/fixtures/tsconfig');

    it('should create default NgParserHost success', () => {
        const tsConfigPath = toolkit.path.resolve(fixtureRootDir, './tsconfig.json');
        const parserHost = createNgParserHost({
            tsConfigPath: tsConfigPath
        });
        expect(parserHost).toBeTruthy();
        expect(parserHost.program).toBeTruthy();

        const sourceFiles = parserHost.program.getSourceFiles();
        expect(sourceFiles).toBeTruthy();
        const publicAPISourceFilePath = toolkit.path.getTSSystemPath(toolkit.path.resolve(fixtureRootDir, 'src/public-api.ts'));
        const buttonSourceFilePath = toolkit.path.getTSSystemPath(toolkit.path.resolve(fixtureRootDir, 'src/button/button.component.ts'));
        const publicAPISourceFile = sourceFiles.find(sourceFile => {
            return sourceFile.fileName === publicAPISourceFilePath;
        });
        const buttonSourceFile = sourceFiles.find(sourceFile => {
            return sourceFile.fileName === buttonSourceFilePath;
        });
        expect(publicAPISourceFile).toBeTruthy();
        expect(buttonSourceFile).toBeTruthy();
        expect(sourceFiles.length > 0).toBeTruthy();
    });

    it('should getSourceFileByPath', () => {
        const tsConfigPath = toolkit.path.resolve(fixtureRootDir, './tsconfig.json');
        const parserHost = createNgParserHost({
            tsConfigPath: tsConfigPath
        });
        const buttonPath = toolkit.path.getSystemPath(toolkit.path.resolve(fixtureRootDir, 'src/button/*.ts'));
        const filePaths = toolkit.fs.globSync(buttonPath);
        console.log(filePaths);
        expect(filePaths.length).toBeGreaterThanOrEqual(1);
        const filePath = filePaths[0];
        const finalPath = ts.sys.useCaseSensitiveFileNames ? filePath : filePath.toLowerCase();
        console.log(`finalPath: ${finalPath}`);
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
            watcher: (event, filename) => {}
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
});
