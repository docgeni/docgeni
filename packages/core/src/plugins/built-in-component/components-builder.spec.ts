import { toolkit } from '@docgeni/toolkit';
import * as systemPath from 'path';
import { Subscription } from 'rxjs';
import { DocgeniContext } from '../../docgeni.interface';
import { createTestDocgeniContext, DEFAULT_TEST_ROOT_PATH, writeFilesToHost } from '../../testing';
import * as builtInModule from './built-in-module';
import { ComponentBuilder } from './component-builder';
import { ComponentsBuilder } from './components-builder';

const COMPONENTS_ROOT_PATH: string = `${DEFAULT_TEST_ROOT_PATH}/.docgeni/components`;

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
        [`${COMPONENTS_ROOT_PATH}/color/color.component.ts`]: `@Component({
            selector: 'my-color',
            templateUrl: './color.component.html'
        }) export class ColorComponent {};`,
        [`${COMPONENTS_ROOT_PATH}/color/color.component.html`]: 'color',
        [`${COMPONENTS_ROOT_PATH}/world-standalone/world-standalone.component.ts`]: `class WorldStandaloneComponent {}; export default { selector: "world-standalone", component: WorldStandaloneComponent, standalone: true }`,
        [`${COMPONENTS_ROOT_PATH}/world-standalone/world-standalone.component.html`]: 'world',
        [`${COMPONENTS_ROOT_PATH}/heart-standalone/heart-standalone.component.ts`]: `@Component({
            selector: 'my-heart-standalone',
            templateUrl: './heart-standalone.component.html',
            standalone: true
        }) export class HeartStandaloneComponent {};`,
        [`${COMPONENTS_ROOT_PATH}/heart-standalone/heart-standalone.component.html`]: 'heart'
    };

    beforeEach(() => {
        context = createTestDocgeniContext({
            initialFiles
        });

        toolkit.initialize({
            baseDir: systemPath.resolve(__dirname, '../')
        });

        componentsDistPath = toolkit.path.resolve(context.paths.absSiteContentPath, 'components/custom');
    });

    describe('basic', () => {
        it('should build components success', async () => {
            await writeFilesToHost(context.host, { [`${COMPONENTS_ROOT_PATH}/module.ts`]: 'export default { imports: [] }' });
            const builtInModuleSpy = spyOn(builtInModule, 'generateBuiltInComponentsModule');
            const moduleText = 'module text';
            builtInModuleSpy.and.returnValue(Promise.resolve(moduleText));
            const componentsBuilder = new ComponentsBuilder(context);
            await componentsBuilder.build();
            await componentsBuilder.emit();
            const helloComponentContent = await context.host.readFile(toolkit.path.resolve(componentsDistPath, 'hello/hello.component.ts'));
            expect(helloComponentContent).toEqual(initialFiles[`${COMPONENTS_ROOT_PATH}/hello/hello.component.ts`]);
            const entryContent = await context.host.readFile(toolkit.path.resolve(componentsDistPath, 'index.ts'));

            const components = (componentsBuilder as any).components as Map<string, ComponentBuilder>;

            expect(components.get(`${COMPONENTS_ROOT_PATH}/hello`)!.metadata).toEqual({
                selector: 'hello',
                name: 'HelloComponent',
                standalone: false
            });

            expect(entryContent).toEqual(moduleText);
        });

        it('should build standalone components success', async () => {
            await writeFilesToHost(context.host, { [`${COMPONENTS_ROOT_PATH}/module.ts`]: 'export default { imports: [] }' });
            const builtInModuleSpy = spyOn(builtInModule, 'generateBuiltInComponentsModule');
            const moduleText = 'module text';
            builtInModuleSpy.and.returnValue(Promise.resolve(moduleText));
            const componentsBuilder = new ComponentsBuilder(context);
            await componentsBuilder.build();
            await componentsBuilder.emit();
            const helloComponentContent = await context.host.readFile(
                toolkit.path.resolve(componentsDistPath, 'world-standalone/world-standalone.component.ts')
            );
            expect(helloComponentContent).toEqual(initialFiles[`${COMPONENTS_ROOT_PATH}/world-standalone/world-standalone.component.ts`]);
            const entryContent = await context.host.readFile(toolkit.path.resolve(componentsDistPath, 'index.ts'));

            const components = (componentsBuilder as any).components as Map<string, ComponentBuilder>;

            expect(components.get(`${COMPONENTS_ROOT_PATH}/world-standalone`)!.metadata).toEqual({
                selector: 'world-standalone',
                name: 'WorldStandaloneComponent',
                standalone: true
            });

            expect(entryContent).toEqual(moduleText);
        });

        it('should build components success when has`t export default', async () => {
            await writeFilesToHost(context.host, { [`${COMPONENTS_ROOT_PATH}/module.ts`]: 'export default { imports: [] }' });
            const builtInModuleSpy = spyOn(builtInModule, 'generateBuiltInComponentsModule');
            const moduleText = 'module text';
            builtInModuleSpy.and.returnValue(Promise.resolve(moduleText));
            const componentsBuilder = new ComponentsBuilder(context);
            await componentsBuilder.build();
            await componentsBuilder.emit();

            const components = (componentsBuilder as any).components as Map<string, ComponentBuilder>;

            expect(components.get(`${COMPONENTS_ROOT_PATH}/color`)!.metadata).toEqual({
                selector: 'my-color',
                name: 'ColorComponent',
                standalone: false
            });
        });

        it('should build standalone components success when has`t export default', async () => {
            await writeFilesToHost(context.host, { [`${COMPONENTS_ROOT_PATH}/module.ts`]: 'export default { imports: [] }' });
            const builtInModuleSpy = spyOn(builtInModule, 'generateBuiltInComponentsModule');
            const moduleText = 'module text';
            builtInModuleSpy.and.returnValue(Promise.resolve(moduleText));
            const componentsBuilder = new ComponentsBuilder(context);
            await componentsBuilder.build();
            await componentsBuilder.emit();

            const components = (componentsBuilder as any).components as Map<string, ComponentBuilder>;

            expect(components.get(`${COMPONENTS_ROOT_PATH}/heart-standalone`)!.metadata).toEqual({
                selector: 'my-heart-standalone',
                name: 'HeartStandaloneComponent',
                standalone: true
            });
        });

        it('should build success when not exist module.ts', async () => {
            const builtInModuleSpy = spyOn(builtInModule, 'generateBuiltInComponentsModule');
            const moduleText = 'module text';
            builtInModuleSpy.and.returnValue(Promise.resolve(moduleText));
            const componentsBuilder = new ComponentsBuilder(context);
            await componentsBuilder.build();
            await componentsBuilder.emit();
            const helloComponentContent = await context.host.readFile(toolkit.path.resolve(componentsDistPath, 'hello/hello.component.ts'));
            expect(helloComponentContent).toEqual(initialFiles[`${COMPONENTS_ROOT_PATH}/hello/hello.component.ts`]);
            const entryContent = await context.host.readFile(toolkit.path.resolve(componentsDistPath, 'index.ts'));

            const components = (componentsBuilder as any).components as Map<string, ComponentBuilder>;

            expect(components.get(`${COMPONENTS_ROOT_PATH}/hello`)!.metadata).toEqual({
                selector: 'hello',
                name: 'HelloComponent',
                standalone: false
            });

            expect(entryContent).toEqual(moduleText);
        });

        it('should ignore without exported components when generating entry module', async () => {
            await writeFilesToHost(context.host, { [`${COMPONENTS_ROOT_PATH}/color/color.component.ts`]: 'export class A {}' });

            const componentsBuilder = new ComponentsBuilder(context);
            await componentsBuilder.build();
            await componentsBuilder.emit();
            const entryContent = await context.host.readFile(toolkit.path.resolve(componentsDistPath, 'index.ts'));
            expect(entryContent).not.toContain('color');
            expect(entryContent).toContain('hello');
        });
    });

    describe('watch', () => {
        let componentsBuilder: ComponentsBuilder;
        let subscription: Subscription;
        beforeEach(async () => {
            await writeFilesToHost(context.host, { [`${COMPONENTS_ROOT_PATH}/module.ts`]: 'export default { imports: [] }' });
            componentsBuilder = new ComponentsBuilder(context);
            await componentsBuilder.build();
            await componentsBuilder.emit();
            (context as any).watch = true;
            subscription = componentsBuilder.watch() as Subscription;
        });

        afterEach(() => {
            subscription.unsubscribe();
        });

        it('should update file success', async () => {
            const originalEntryContent = await context.host.readFile(toolkit.path.resolve(componentsDistPath, 'index.ts'));
            expect(originalEntryContent).toContain(`'hello'`);
            expect(originalEntryContent).toContain('HelloComponent');

            const newHelloComponentSource = `@Component({ selector: 'hello-new', templateUrl: './hello.component.html' }) export class MyHelloComponent {}`;
            await context.host.writeFile(toolkit.path.resolve(COMPONENTS_ROOT_PATH, './hello/hello.component.ts'), newHelloComponentSource);
            await toolkit.utils.wait(0);
            expect(await context.host.readFile(toolkit.path.resolve(componentsDistPath, 'hello/hello.component.ts'))).toEqual(
                newHelloComponentSource
            );

            const latestEntryContent = await context.host.readFile(toolkit.path.resolve(componentsDistPath, 'index.ts'));

            expect(latestEntryContent).toContain('hello-new');
            expect(latestEntryContent).toContain('MyHelloComponent');
            expect(latestEntryContent).not.toContain(`'hello'`);
            expect(latestEntryContent).not.toContain(`'HelloComponent'`);
        });

        it('should create file success', async () => {
            const newComponentPath = `${COMPONENTS_ROOT_PATH}/hello1`;
            const hello1Text = `class Hello1Component {}; export default { selector: "hello1", component: Hello1Component }`;
            await context.host.writeFile(
                toolkit.path.resolve(newComponentPath, 'hello1.component.ts'),
                'class Hello1Component {}; export default { selector: "hello1", component: Hello1Component }'
            );

            await toolkit.utils.wait(0);
            const newFileContent = await context.host.readFile(toolkit.path.resolve(componentsDistPath, 'hello1/hello1.component.ts'));
            expect(newFileContent).toEqual(hello1Text);

            const entryContent = await context.host.readFile(toolkit.path.resolve(componentsDistPath, 'index.ts'));
            expect(entryContent).toContain('hello1');
            expect(entryContent).toContain('Hello1Component');
        });

        it('should delete file success', async () => {
            await context.host.delete(toolkit.path.resolve(COMPONENTS_ROOT_PATH, 'hello/hello.component.ts'));
            await toolkit.utils.wait(0);
            expect(await context.host.pathExists(toolkit.path.resolve(componentsDistPath, 'hello'))).toBeFalsy();

            const entryContent = await context.host.readFile(toolkit.path.resolve(componentsDistPath, 'index.ts'));
            expect(entryContent).not.toContain('hello');
            expect(entryContent).not.toContain('HelloComponent');
        });

        it('should do nothings when create file is not component', async () => {
            await context.host.writeFile(toolkit.path.resolve(COMPONENTS_ROOT_PATH, 'hello1.component.ts'), 'new content');
            await toolkit.utils.wait(0);
            expect(await context.host.pathExists(toolkit.path.resolve(componentsDistPath, 'hello1.component.ts'))).toBeFalsy();

            const entryContent = await context.host.readFile(toolkit.path.resolve(componentsDistPath, 'index.ts'));
            expect(entryContent).not.toContain('hello1');
        });
    });
});
