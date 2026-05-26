import { DocgeniContext } from '../docgeni.interface';
import {
    writeFilesToHost,
    assertExpectedFiles,
    createTestDocgeniContext,
    DEFAULT_TEST_ROOT_PATH,
    FixtureResult,
    loadFixture,
    updateContext,
    updateContextConfig,
} from '../testing';
import AngularSitePlugin from './site-plugin';
import { toolkit, fs } from '@docgeni/toolkit';
import * as systemPath from 'path';
import { of, Subject } from 'rxjs';
import { EventEmitter } from 'stream';
import { SpawnOptions } from 'child_process';
import { parse as parseJsonc } from 'jsonc-parser';

const SITE_TEMPLATE_PATH = toolkit.path.resolve(__dirname, '../site-template');

const PUBLIC_PATH = `${DEFAULT_TEST_ROOT_PATH}/.docgeni/public`;
const DEFAULT_SITE_PATH = `${DEFAULT_TEST_ROOT_PATH}/.docgeni/site`;
const SRC_APP_PATH = `${DEFAULT_TEST_ROOT_PATH}/.docgeni/app`;

describe('#site-plugin', () => {
    let ngSitePlugin: AngularSitePlugin;
    let context: DocgeniContext;
    let fixture: FixtureResult;

    beforeAll(async () => {
        toolkit.initialize({
            baseDir: systemPath.resolve(__dirname, '../'),
        });
        fixture = await loadFixture('default-site');
    });

    beforeEach(() => {
        context = createTestDocgeniContext({
            initialFiles: {
                [`${DEFAULT_TEST_ROOT_PATH}/node_modules/@angular/core/package.json`]: fixture.src['package.json'],
                [`${DEFAULT_TEST_ROOT_PATH}/angular.json`]: fixture.src['angular.json'],
                [`${SITE_TEMPLATE_PATH}/src/main.ts`]: 'main.ts',
                [`${SITE_TEMPLATE_PATH}/src/app/app.config.ts`]: fixture.getOutputContent('app/app.config.ts'),
            },
        });
        ngSitePlugin = new AngularSitePlugin();
        ngSitePlugin.apply(context);
    });

    it('should create site success', async () => {
        await context.hooks.beforeRun.promise();
        await assertExpectedFiles(
            context.host,
            {
                [`${DEFAULT_SITE_PATH}/angular.json`]: fixture.getOutputContent('angular.json'),
                [`${DEFAULT_SITE_PATH}/tsconfig.app.json`]: fixture.getOutputContent('tsconfig.app.json'),
                [`${DEFAULT_SITE_PATH}/src/main.ts`]: 'main.ts',
                [`${DEFAULT_SITE_PATH}/src/app/app.config.ts`]: fixture.getOutputContent('app/app.config.ts'),
            },
            true,
        );
        expect(context.paths.absSitePath).toEqual(`${DEFAULT_TEST_ROOT_PATH}/.docgeni/site`);
        expect(context.paths.absSiteContentPath).toEqual(`${DEFAULT_SITE_PATH}/src/app/content`);
        expect(context.enableIvy).toBeTruthy();
    });

    it('should create site with ssg renderMode', async () => {
        updateContextConfig(context, { renderMode: 'ssg' });
        await context.hooks.beforeRun.promise();
        const angularJson = parseJsonc(await context.host.readFile(`${DEFAULT_SITE_PATH}/angular.json`));
        const buildOptions = angularJson.projects.site.architect.build.options;
        expect(buildOptions.server).toBe('src/main.server.ts');
        expect(buildOptions.outputMode).toBe('static');
        expect(buildOptions.ssr).toBeUndefined();
        const serverRoutes = await context.host.readFile(`${DEFAULT_SITE_PATH}/src/app/app.routes.server.ts`);
        expect(serverRoutes).toContain(`path: '~examples/:name'`);
        expect(serverRoutes).toContain('RenderMode.Client');
        expect(serverRoutes).toContain('RenderMode.Prerender');
    });

    it('should create site with ssr renderMode', async () => {
        updateContextConfig(context, { renderMode: 'ssr' });
        await context.hooks.beforeRun.promise();
        const angularJson = parseJsonc(await context.host.readFile(`${DEFAULT_SITE_PATH}/angular.json`));
        const buildOptions = angularJson.projects.site.architect.build.options;
        expect(buildOptions.server).toBe('src/main.server.ts');
        expect(buildOptions.outputMode).toBe('server');
        expect(buildOptions.outputPath.browser).toBe('browser');
        expect(buildOptions.ssr.entry).toBe('src/server.ts');
        const serverRoutes = await context.host.readFile(`${DEFAULT_SITE_PATH}/src/app/app.routes.server.ts`);
        expect(serverRoutes).toContain(`path: '~examples/:name'`);
        expect(serverRoutes).toContain('RenderMode.Client');
        expect(serverRoutes).toContain('RenderMode.Prerender');
    });

    it('should use custom site', async () => {
        context.config.siteProjectName = 'customSite';
        await context.hooks.beforeRun.promise();
        expect(await context.host.exists(`${DEFAULT_TEST_ROOT_PATH}/.docgeni/site`)).toBeFalsy();
        expect(context.paths.absSitePath).toEqual(`${DEFAULT_TEST_ROOT_PATH}/custom/site`);
        expect(context.paths.absSiteContentPath).toEqual(`${DEFAULT_TEST_ROOT_PATH}/custom/site/src/app/content`);
    });

    it('should watch custom site success', async () => {
        const sitePath = `${DEFAULT_TEST_ROOT_PATH}/custom/site`;
        context.config.siteProjectName = 'customSite';
        const watchAggregated$ = new Subject<fs.HostWatchEvent[]>();

        updateContext(context, { watch: true });
        const watchAggregatedSpy = spyOn(context.host, 'watchAggregated');
        watchAggregatedSpy.and.callFake((files) => {
            expect(files).toEqual([`${sitePath}/src/assets/stack-blitz`]);
            return watchAggregated$.asObservable();
        });
        await context.hooks.beforeRun.promise();
        const text1 = toolkit.strings.generateRandomId();
        await writeFilesToHost(context.host, {
            [`${sitePath}/src/assets/stack-blitz/a.txt`]: text1,
        });
        expect(await context.host.exists(`${sitePath}/src/assets/stack-blitz/a.txt`)).toBeTruthy();
        watchAggregated$.next([
            {
                type: fs.HostWatchEventType.Created,
                path: toolkit.path.normalize(`${sitePath}/src/assets/stack-blitz/a.txt`),
                time: new Date(),
            },
        ]);

        await toolkit.utils.wait(2000);

        expect(await context.host.exists(`${sitePath}/src/assets/stack-blitz/a.txt`)).toBeTruthy();
        expect(await context.host.exists(`${sitePath}/src/assets/stack-blitz/bundle.json`)).toBeTruthy();
    });

    it('should copy public dir success', async () => {
        const text1 = toolkit.strings.generateRandomId();
        const text2 = toolkit.strings.generateRandomId();
        const html = toolkit.strings.generateRandomId();
        const scss = toolkit.strings.generateRandomId();

        await writeFilesToHost(context.host, {
            [`${PUBLIC_PATH}/tsconfig.json`]: `{"name": "test"}`,
            [`${PUBLIC_PATH}/assets/1.txt`]: text1,
            [`${PUBLIC_PATH}/index.html`]: html,
            [`${PUBLIC_PATH}/styles.scss`]: scss,
            [`${PUBLIC_PATH}/.browserslistrc`]: text2,
        });

        await context.hooks.beforeRun.promise();

        assertExpectedFiles(context.host, {
            [`${DEFAULT_SITE_PATH}/tsconfig.app.json`]: `{"name": "test"}`,
            [`${DEFAULT_SITE_PATH}/.browserslistrc`]: text2,
            [`${DEFAULT_SITE_PATH}/src/index.html`]: html,
            [`${DEFAULT_SITE_PATH}/src/styles.scss`]: scss,
            [`${DEFAULT_SITE_PATH}/src/assets/1.txt`]: text1,
        });
    });

    it('should watch public dir success', async () => {
        const watchAggregated$ = new Subject<fs.HostWatchEvent[]>();
        await writeFilesToHost(context.host, {
            [`${PUBLIC_PATH}/tsconfig.json`]: `{"name": "test"}`,
            [`${PUBLIC_PATH}/assets/2.txt`]: `2.txt`,
        });
        updateContext(context, { watch: true });
        const watchAggregatedSpy = spyOn(context.host, 'watchAggregated');
        watchAggregatedSpy.and.callFake((files) => {
            expect(files).toEqual([
                `${PUBLIC_PATH}/assets`,
                `${PUBLIC_PATH}/styles.scss`,
                `${PUBLIC_PATH}/index.html`,
                `${PUBLIC_PATH}/favicon.ico`,
                `${PUBLIC_PATH}/.browserslistrc`,
                `${PUBLIC_PATH}/tsconfig.json`,
            ]);
            return watchAggregated$.asObservable();
        });

        await context.hooks.beforeRun.promise();

        const text1 = toolkit.strings.generateRandomId();
        const text2 = toolkit.strings.generateRandomId();
        const html = toolkit.strings.generateRandomId();
        const scss = toolkit.strings.generateRandomId();
        await writeFilesToHost(context.host, {
            [`${PUBLIC_PATH}/tsconfig.json`]: `{"name": "test1"}`,
            [`${PUBLIC_PATH}/assets/1.txt`]: text1,
            [`${PUBLIC_PATH}/index.html`]: html,
            [`${PUBLIC_PATH}/styles.scss`]: scss,
            [`${PUBLIC_PATH}/.browserslistrc`]: text2,
        });
        expect(await context.host.exists(`${DEFAULT_SITE_PATH}/src/assets/2.txt`)).toBeTruthy();
        expect(await context.host.exists(`${DEFAULT_SITE_PATH}/tsconfig.app.json`)).toBeTruthy();
        watchAggregated$.next([
            {
                type: toolkit.fs.HostWatchEventType.Created,
                path: toolkit.path.normalize(`${PUBLIC_PATH}/index.html`),
                time: new Date(),
            },
            {
                type: toolkit.fs.HostWatchEventType.Created,
                path: toolkit.path.normalize(`${PUBLIC_PATH}/assets/1.txt`),
                time: new Date(),
            },
            {
                type: toolkit.fs.HostWatchEventType.Deleted,
                path: toolkit.path.normalize(`${PUBLIC_PATH}/assets/2.txt`),
                time: new Date(),
            },
            {
                type: toolkit.fs.HostWatchEventType.Deleted,
                path: toolkit.path.normalize(`${PUBLIC_PATH}/tsconfig.json`),
                time: new Date(),
            },
        ]);

        await toolkit.utils.wait(2000);

        await assertExpectedFiles(context.host, {
            [`${DEFAULT_SITE_PATH}/src/index.html`]: html,
            [`${DEFAULT_SITE_PATH}/src/assets/1.txt`]: text1,
        });
        expect(await context.host.exists(`${DEFAULT_SITE_PATH}/src/assets/2.txt`)).toBeFalsy();
        expect(await context.host.exists(`${DEFAULT_SITE_PATH}/tsconfig.app.json`)).toBeFalsy();
    });

    it('should add lib paths to tsconfig.app.json', async () => {
        updateContextConfig(context, {
            libs: [
                {
                    name: 'lib1',
                    rootDir: 'lib1-src',
                },
            ],
        });
        await writeFilesToHost(context.host, {
            [`${DEFAULT_TEST_ROOT_PATH}/lib1-src/package.json`]: `{"name": "@test/lib1"}`,
        });
        await context.hooks.beforeRun.promise();
        expect(await context.host.exists(`${DEFAULT_SITE_PATH}/tsconfig.app.json`));
        const tsConfigContent = await context.host.readFile(`${DEFAULT_SITE_PATH}/tsconfig.app.json`);
        const tsConfig = parseJsonc(tsConfigContent);
        expect(tsConfig.compilerOptions.paths).toEqual({
            '@test/lib1/*': ['../../lib1-src/*'],
            '@test/lib1': ['../../lib1-src/index.ts', '../../lib1-src/public-api.ts'],
        });
    });

    it('should exec angular command success', async () => {
        const deployUrl = `/${toolkit.strings.generateRandomId()}/`;
        updateContextConfig(context, { deployUrl: deployUrl });
        await context.hooks.beforeRun.promise();

        let calledSpawn = false;
        ngSitePlugin.siteBuilder.spawn = function (command: string, commandArgs: string[], options: SpawnOptions) {
            expect(command).toEqual('ng');
            expect(commandArgs).toEqual(['build', 'site', '--deploy-url', deployUrl]);
            expect(options).toEqual({
                stdio: 'inherit',
                cwd: toolkit.path.getSystemPath(`${DEFAULT_TEST_ROOT_PATH}/.docgeni/site`),
                shell: process.platform === 'win32',
            });
            calledSpawn = true;
            return new EventEmitter();
        } as any;
        expect(calledSpawn).toEqual(false);
        await context.hooks.done.promise();
        expect(calledSpawn).toEqual(true);
    });

    it('should exec angular command success when site is custom', async () => {
        const deployUrl = `/${toolkit.strings.generateRandomId()}/`;
        updateContextConfig(context, { deployUrl: deployUrl, siteProjectName: 'customSite' });
        await context.hooks.beforeRun.promise();

        let calledSpawn = false;
        ngSitePlugin.siteBuilder.spawn = function (command: string, commandArgs: string[], options: SpawnOptions) {
            expect(command).toEqual('ng');
            expect(commandArgs).toEqual(['build', 'customSite', '--deploy-url', deployUrl]);
            expect(options).toEqual({
                stdio: 'inherit',
                cwd: undefined,
                shell: process.platform === 'win32',
            });
            calledSpawn = true;
            return new EventEmitter();
        } as any;
        expect(calledSpawn).toEqual(false);
        await context.hooks.done.promise();
        expect(calledSpawn).toEqual(true);
    });

    describe('src/app', () => {
        it('should generate new app config and copy other source files in ".docgeni/app" dir', async () => {
            const moduleText = `export default { providers: [ AClass ] }`;
            await writeFilesToHost(context.host, {
                [`${SRC_APP_PATH}/module.ts`]: moduleText,
                [`${SRC_APP_PATH}/a.ts`]: 'const export a = "aaa"',
                [`${SRC_APP_PATH}/sub/b.ts`]: 'const export b = "bbb"',
            });
            await context.hooks.beforeRun.promise();
            await assertExpectedFiles(
                context.host,
                {
                    [`${DEFAULT_SITE_PATH}/src/app/a.ts`]: 'const export a = "aaa"',
                    [`${DEFAULT_SITE_PATH}/src/app/sub/b.ts`]: 'const export b = "bbb"',
                },
                true,
            );
            const appConfig = await context.host.readFile(`${DEFAULT_SITE_PATH}/src/app/app.config.ts`);
            expect(appConfig).toContain(`AClass`);
            expect(appConfig).toContain(`...DOCGENI_SITE_PROVIDERS`);
        });

        it('should copy new files when ".docgeni/app" dir files changed', async () => {
            await writeFilesToHost(context.host, {
                [`${SRC_APP_PATH}/a.ts`]: 'const export a = "aaa"',
                [`${SRC_APP_PATH}/sub/b.ts`]: 'const export b = "bbb"',
            });
            updateContext(context, { watch: true });
            const watchAggregatedSpy = spyOn(context.host, 'watchAggregated');
            const watchAggregated$ = new Subject<fs.HostWatchEvent[]>();
            watchAggregatedSpy.and.callFake((files) => {
                return watchAggregated$.asObservable();
            });
            await context.hooks.beforeRun.promise();

            await writeFilesToHost(context.host, {
                [`${SRC_APP_PATH}/a.ts`]: 'const export a = "new"',
                [`${SRC_APP_PATH}/c.ts`]: 'const export c = "ccc"',
            });

            watchAggregated$.next([
                {
                    type: fs.HostWatchEventType.Created,
                    path: toolkit.path.normalize(`${SRC_APP_PATH}/c.ts`),
                    time: new Date(),
                },
                {
                    type: fs.HostWatchEventType.Changed,
                    path: toolkit.path.normalize(`${SRC_APP_PATH}/a.ts`),
                    time: new Date(),
                },
                {
                    type: fs.HostWatchEventType.Deleted,
                    path: toolkit.path.normalize(`${SRC_APP_PATH}/sub/b.ts`),
                    time: new Date(),
                },
            ]);

            await toolkit.utils.wait(2000);
            expect(await context.host.exists(`${DEFAULT_SITE_PATH}/src/sub/b.ts`)).toBeFalsy();
            await assertExpectedFiles(
                context.host,
                {
                    [`${DEFAULT_SITE_PATH}/src/app/a.ts`]: 'const export a = "new"',
                    [`${DEFAULT_SITE_PATH}/src/app/c.ts`]: 'const export c = "ccc"',
                },
                true,
            );
        });

        it('should rebuild app config when module.ts changed', async () => {
            const moduleText = `export default { providers: [ AClass ] }`;
            await writeFilesToHost(context.host, {
                [`${SRC_APP_PATH}/module.ts`]: moduleText,
            });
            updateContext(context, { watch: true });
            const watchAggregatedSpy = spyOn(context.host, 'watchAggregated');
            const watchAggregated$ = new Subject<fs.HostWatchEvent[]>();
            watchAggregatedSpy.and.callFake((files) => {
                return watchAggregated$.asObservable();
            });
            await context.hooks.beforeRun.promise();
            const appConfig = await context.host.readFile(toolkit.path.resolve(DEFAULT_SITE_PATH, './src/app/app.config.ts'));
            expect(appConfig).toContain(`AClass`);
            expect(appConfig).toContain(`...DOCGENI_SITE_PROVIDERS`);

            const newModuleText = `export default { providers: [ NewClass ] }`;
            await writeFilesToHost(context.host, {
                [`${SRC_APP_PATH}/module.ts`]: newModuleText,
            });

            watchAggregated$.next([
                {
                    type: fs.HostWatchEventType.Changed,
                    path: toolkit.path.normalize(`${SRC_APP_PATH}/module.ts`),
                    time: new Date(),
                },
            ]);

            await toolkit.utils.wait(2000);
            const newAppConfig = await context.host.readFile(toolkit.path.resolve(DEFAULT_SITE_PATH, './src/app/app.config.ts'));
            expect(newAppConfig).toContain(`NewClass`);
            expect(newAppConfig).toContain(`...DOCGENI_SITE_PROVIDERS`);
        });
    });
});
