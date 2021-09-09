import { virtualFs, normalize } from '@angular-devkit/core';
import { EOL } from 'os';
import { DocgeniHost } from '../docgeni-host';
import { createTestDocgeniHost } from '../testing';
import { DocSourceFile } from './doc-file';
import path from 'path';

describe('DocSourceFile', () => {
    let root: string;
    let testHost: virtualFs.Host;
    let docgeniHost: DocgeniHost;
    beforeAll(() => {
        spyOn(DocSourceFile.prototype, 'getContributionInfo' as any).and.returnValue({ lastUpdatedTime: 0, contributors: [] });
    });

    beforeEach(() => {
        root = '/root/test/';
        testHost = new virtualFs.test.TestHost({});
        docgeniHost = createTestDocgeniHost(new virtualFs.ScopedHost(testHost, normalize(root)));
    });

    describe('property', () => {
        let docSourceFile: DocSourceFile;

        beforeEach(() => {
            docSourceFile = new DocSourceFile(
                {
                    cwd: root,
                    path: `${root}/docs/getting-started.md`,
                    base: root,
                    locale: 'zh-cn'
                },
                docgeniHost
            );
        });

        it('should get correct name', async () => {
            expect(docSourceFile.name).toEqual(`getting-started`);
        });

        it('should throw error when path is empty', () => {
            const docSourceFile = new DocSourceFile(
                {
                    cwd: root,
                    path: null,
                    base: root,
                    locale: 'zh-cn'
                },
                docgeniHost
            );
            expect(() => {
                const name = docSourceFile.name;
            }).toThrowError(`No path specified! can not get name.`);
        });

        it('should get correct basename', async () => {
            expect(docSourceFile.basename).toEqual(`getting-started.md`);
        });

        it('should get correct extname', async () => {
            expect(docSourceFile.extname).toEqual(`.md`);
        });

        it('should get correct dirname', async () => {
            expect(docSourceFile.dirname).toEqual(`${root}/docs`);
        });

        it('should get correct relative', async () => {
            expect(docSourceFile.relative).toEqual(`docs/getting-started.md`);
        });

        it('should get correct relative', async () => {
            expect(docSourceFile.relativeDirname).toEqual(`docs`);
        });
    });

    describe('out path', () => {
        let docSourceFile: DocSourceFile;

        beforeEach(() => {
            docSourceFile = new DocSourceFile(
                {
                    cwd: root,
                    path: `${root}/docs/getting-started.md`,
                    base: root,
                    locale: 'zh-cn'
                },
                docgeniHost
            );
        });

        it('should get correct outputDir', async () => {
            const outputRootPath = '/dest/path';
            const outDir = docSourceFile.getOutputDir(outputRootPath);
            expect(outDir).toEqual(path.resolve(outputRootPath, 'docs'));
        });

        it('should get correct relativeOutputPath', async () => {
            const outDir = docSourceFile.getRelativeOutputPath();
            expect(outDir).toEqual(`docs/getting-started.html`);
        });

        it('should get correct relativeOutputPath when pass extname', async () => {
            const outDir = docSourceFile.getRelativeOutputPath('.htm');
            expect(outDir).toEqual(`docs/getting-started.htm`);
        });

        it('should get correct outPath', async () => {
            const outputRootPath = '/dest/path';
            const outPath = docSourceFile.getOutputPath(outputRootPath);
            expect(outPath).toEqual(path.resolve(outputRootPath, `docs/getting-started.html`));
        });

        it(`should get correct outPath when ext = '.htm'`, async () => {
            const outputRootPath = '/dest/path';
            const outPath = docSourceFile.getOutputPath(outputRootPath, '.htm');
            expect(outPath).toEqual(path.resolve(outputRootPath, `docs/getting-started.htm`));
        });
    });

    it('should build file success', async () => {
        await docgeniHost.writeFile(
            'docs/getting-started.md',
            `---${EOL}title: Title FrontMatter${EOL}order: 10${EOL}path: /custom/path${EOL}---${EOL}getting-started content`
        );
        const docSourceFile = new DocSourceFile(
            {
                cwd: root,
                path: 'docs/getting-started.md',
                base: root,
                locale: 'zh-cn'
            },
            docgeniHost
        );
        await docSourceFile.build();
        expect(docSourceFile.output).toContain(`<p>getting-started content</p>`);
        expect(docSourceFile.meta).toEqual({
            title: 'Title FrontMatter',
            order: 10,
            path: '/custom/path',
            lastUpdatedTime: 0,
            contributors: []
        });
    });

    it('should emit file success', async () => {
        const fileAbsPath = `${root}docs/getting-started.md`;
        await docgeniHost.writeFile(fileAbsPath, `content`);
        const docSourceFile = new DocSourceFile(
            {
                cwd: root,
                path: fileAbsPath,
                base: root,
                locale: 'zh-cn'
            },
            docgeniHost
        );
        await docSourceFile.build();
        await docSourceFile.emit('/dest/root');
        const outputFilePath = path.resolve(`/dest/root/`, `docs/getting-started.html`);
        expect(await docgeniHost.pathExists(outputFilePath)).toBeTruthy();
        const outputContent = await docgeniHost.readFile(outputFilePath);
        expect(outputContent).toContain(`<p>content</p>`);
        await docSourceFile.emit('/dest/root1');
        expect(await docgeniHost.pathExists(outputFilePath)).toBeTruthy();
    });

    it('should clear file success', async () => {
        const fileAbsPath = `${root}docs/getting-started.md`;
        await docgeniHost.writeFile(fileAbsPath, `content`);
        const docSourceFile = new DocSourceFile(
            {
                cwd: root,
                path: fileAbsPath,
                base: root,
                locale: 'zh-cn'
            },
            docgeniHost
        );
        await docSourceFile.build();
        await docSourceFile.emit('/dest/root');
        const outputFilePath = path.resolve(`/dest/root/`, `docs/getting-started.html`);
        expect(await docgeniHost.pathExists(outputFilePath)).toBeTruthy();
        await docSourceFile.clear();
        expect(await docgeniHost.pathExists(outputFilePath)).toBeFalsy();
        expect(docSourceFile.output).toBeFalsy();
        expect(docSourceFile.meta).toBeFalsy();
    });

    it('should auto delete last file when emit diff output path', async () => {
        const fileAbsPath = `${root}docs/getting-started.md`;
        await docgeniHost.writeFile(fileAbsPath, `content`);
        const docSourceFile = new DocSourceFile(
            {
                cwd: root,
                path: fileAbsPath,
                base: root,
                locale: 'zh-cn'
            },
            docgeniHost
        );
        await docSourceFile.build();
        await docSourceFile.emit('/dest/root');
        const outputFilePath = path.resolve(`/dest/root/`, `docs/getting-started.html`);
        expect(await docgeniHost.pathExists(outputFilePath)).toBeTruthy();
        await docSourceFile.build();
        await docSourceFile.emit('/dest/root2');
        expect(await docgeniHost.pathExists(outputFilePath)).toBeFalsy();
        expect(await docgeniHost.pathExists(path.resolve(`/dest/root2/docs/getting-started.html`))).toBeTruthy();
    });

    it('should get correct isEmpty', async () => {
        const fileAbsPath = `${root}docs/getting-started.md`;
        await docgeniHost.writeFile(fileAbsPath, ``);
        const docSourceFile = new DocSourceFile(
            {
                cwd: root,
                path: fileAbsPath,
                base: root,
                locale: 'zh-cn'
            },
            docgeniHost
        );
        expect(docSourceFile.isEmpty()).toEqual(true);
        await docSourceFile.build();
        expect(docSourceFile.isEmpty()).toEqual(true);
        await docgeniHost.writeFile(fileAbsPath, `content`);
        await docSourceFile.build();
        expect(docSourceFile.isEmpty()).toEqual(false);
    });
});
