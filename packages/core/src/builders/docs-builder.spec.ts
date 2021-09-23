import { toolkit } from '@docgeni/toolkit';
import { of, Subject } from 'rxjs';
import { DocgeniContext } from '../docgeni.interface';
import { HostWatchEvent, HostWatchEventType, normalize } from '../fs';
import { createTestDocgeniContext, DEFAULT_TEST_ROOT_PATH, updateContext } from '../testing';
import { DocsBuilder } from './docs-builder';

describe('#components-builder', () => {
    let context: DocgeniContext;
    beforeEach(() => {
        context = createTestDocgeniContext({
            [`${DEFAULT_TEST_ROOT_PATH}/docs/index.md`]: 'index',
            [`${DEFAULT_TEST_ROOT_PATH}/docs/guides/index.md`]: 'guides',
            [`${DEFAULT_TEST_ROOT_PATH}/docs/guides/hello.md`]: 'hello'
        });
    });

    it('should watch success', async () => {
        const docsBuilder = new DocsBuilder(context);
        await docsBuilder.initialize();
        updateContext(context, { watch: true });
        const watchAggregatedSpy = spyOn(context.host, 'watchAggregated');
        const changes = [
            {
                type: HostWatchEventType.Deleted,
                path: normalize(`${DEFAULT_TEST_ROOT_PATH}/docs/guides/hello.md`),
                time: new Date()
            },
            {
                type: HostWatchEventType.Created,
                path: normalize(`${DEFAULT_TEST_ROOT_PATH}/docs/guides/new.md`),
                time: new Date()
            }
        ];
        const subject = new Subject<HostWatchEvent[]>();
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
            docs: [docsBuilder.getDoc(normalize(`${DEFAULT_TEST_ROOT_PATH}/docs/guides/new.md`))],
            changes: changes
        });
    });
});
