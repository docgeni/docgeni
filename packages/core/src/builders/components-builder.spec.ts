import { DocgeniContext } from '../docgeni.interface';
import { createTestDocgeniContext, createTestDocgeniHost, DEFAULT_TEST_ROOT_PATH } from '../testing';
import { ComponentsBuilder } from './components-builder';
import { toolkit } from '@docgeni/toolkit';
import { Subscription } from 'rxjs';
import { resolve } from '../fs';

const COMPONENTS_ROOT_PATH = `${DEFAULT_TEST_ROOT_PATH}/.docgeni/components`;

let linuxOnlyIt: typeof it = it;
if (process.platform.startsWith('win') || process.platform.startsWith('darwin')) {
    linuxOnlyIt = xit;
}

describe('#components-builder', () => {
    let context: DocgeniContext;
    let componentsDistPath: string;
    const initialFiles = {
        [`${COMPONENTS_ROOT_PATH}/hello/hello.component.ts`]: `class HelloComponent {}; export default { selector: "hello", component: HelloComponent }`,
        [`${COMPONENTS_ROOT_PATH}/hello/hello.component.html`]: 'hello',
        [`${COMPONENTS_ROOT_PATH}/module.ts`]: 'export default { imports: [] }'
    };

    beforeEach(() => {
        context = createTestDocgeniContext({
            initialFiles: initialFiles
        });

        toolkit.initialize({
            baseDir: resolve(__dirname, '../')
        });

        componentsDistPath = resolve(context.paths.absSiteContentPath, 'components/custom');
    });

    it('should build components success', async () => {
        const componentsBuilder = new ComponentsBuilder(context);
        await componentsBuilder.build();
        await componentsBuilder.emit();
        const helloComponentContent = await context.host.readFile(resolve(componentsDistPath, 'hello/hello.component.ts'));
        expect(helloComponentContent).toEqual(initialFiles[`${COMPONENTS_ROOT_PATH}/hello/hello.component.ts`]);
        const entryContent = await context.host.readFile(resolve(componentsDistPath, 'index.ts'));

        const expectContent = await toolkit.fs.readFileContent(resolve(__dirname, './components-builder-expect-entry.txt'));
        expect(entryContent).toEqual(expectContent);
    });

    describe('watch', () => {
        let componentsBuilder: ComponentsBuilder;
        let subscription: Subscription;
        beforeEach(async () => {
            componentsBuilder = new ComponentsBuilder(context);
            await componentsBuilder.build();
            await componentsBuilder.emit();
            (context as any).watch = true;
            subscription = componentsBuilder.watch();
        });

        afterEach(() => {
            subscription.unsubscribe();
        });

        it('should update file success', async () => {
            await context.host.writeFile(resolve(COMPONENTS_ROOT_PATH, './hello/hello.component.ts'), 'new content');
            await toolkit.utils.wait(0);
            expect(await context.host.readFile(resolve(componentsDistPath, 'hello/hello.component.ts'))).toEqual('new content');
        });

        it('should create file success', async () => {
            const newComponentPath = `${COMPONENTS_ROOT_PATH}/hello1`;
            await context.host.writeFile(resolve(newComponentPath, 'hello1.component.ts'), 'new file');

            await toolkit.utils.wait(0);
            const newFileContent = await context.host.readFile(resolve(componentsDistPath, 'hello1/hello1.component.ts'));
            expect(newFileContent).toEqual('new file');
        });

        it('should delete file success', async () => {
            const newComponentPath = `${COMPONENTS_ROOT_PATH}/hello1`;
            await context.host.writeFile(resolve(newComponentPath, 'hello1.component.ts'), 'new file');
            await toolkit.utils.wait(0);
            await context.host.delete(resolve(newComponentPath, 'hello1.component.ts'));
            await toolkit.utils.wait(0);
            expect(await context.host.pathExists(resolve(componentsDistPath, 'hello1'))).toBeFalsy();
        });

        it('should do nothings when create file is not component', async () => {
            await context.host.writeFile(resolve(COMPONENTS_ROOT_PATH, 'hello1.component.ts'), 'new content');
            await toolkit.utils.wait(0);
            expect(await context.host.pathExists(resolve(componentsDistPath, 'hello1.component.ts'))).toBeFalsy();
        });
    });
});
