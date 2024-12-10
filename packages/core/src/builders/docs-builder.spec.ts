import { toolkit, fs } from '@docgeni/toolkit';
import { of, Subject } from 'rxjs';
import { DocgeniContext } from '../docgeni.interface';
import { createTestDocgeniContext, DEFAULT_TEST_ROOT_PATH, updateContext } from '../testing';
import { DocsBuilder } from './docs-builder';

describe('#components-builder', () => {
    let context: DocgeniContext;
    beforeEach(() => {
        context = createTestDocgeniContext({
            initialFiles: {
                [`${DEFAULT_TEST_ROOT_PATH}/docs/index.md`]: 'index',
                [`${DEFAULT_TEST_ROOT_PATH}/docs/guides/index.md`]: 'guides',
                [`${DEFAULT_TEST_ROOT_PATH}/docs/guides/hello.md`]: 'hello',
            },
        });
    });

    it('should emit docs success', async () => {
        const docsBuilder = new DocsBuilder(context);
        const globSyncSyp = spyOn(toolkit.fs, 'globSync');
        const docFiles = ['index.md', 'guides/index.md', 'guides/hello.md'];
        globSyncSyp.and.returnValue(
            docFiles.map((docFile) => {
                return `${DEFAULT_TEST_ROOT_PATH}/docs/${docFile}`;
            }),
        );
        await docsBuilder.initialize();
        await docsBuilder.build();
        await docsBuilder.emit();

        for (const docFile of docFiles) {
            const distFullPath = `${context.paths.absSiteAssetsContentDocsPath}/${docFile.replace('.md', '.html')}`;
            const isExists = await context.host.exists(distFullPath);
            expect(isExists).toEqual(true, `doc file ${docFile} is not exist`);
        }
    });

    it('should watch success', async () => {
        const docsBuilder = new DocsBuilder(context);
        await docsBuilder.initialize();
        updateContext(context, { watch: true });
        const watchAggregatedSpy = spyOn(context.host, 'watchAggregated');
        const changes = [
            {
                type: fs.HostWatchEventType.Deleted,
                path: toolkit.path.normalize(`${DEFAULT_TEST_ROOT_PATH}/docs/guides/hello.md`),
                time: new Date(),
            },
            {
                type: fs.HostWatchEventType.Created,
                path: toolkit.path.normalize(`${DEFAULT_TEST_ROOT_PATH}/docs/guides/new.md`),
                time: new Date(),
            },
        ];
        const subject = new Subject<fs.HostWatchEvent[]>();
        watchAggregatedSpy.and.callFake((path, options) => {
            expect(path).toEqual(`${DEFAULT_TEST_ROOT_PATH}/docs`);
            expect(options).toEqual({ ignoreInitial: true });
            return subject;
        });
        const spyCompile = spyOn(context, 'compile');
        expect(spyCompile).not.toHaveBeenCalled();
        docsBuilder.watch();
        subject.next(changes);
        expect(spyCompile).toHaveBeenCalled();
        expect(spyCompile).toHaveBeenCalledWith({
            docs: [docsBuilder.getDoc(toolkit.path.normalize(`${DEFAULT_TEST_ROOT_PATH}/docs/guides/new.md`))],
            changes: changes,
        });
    });
});
