import { DocgeniContext } from '../docgeni.interface';
import {
    writeFilesToHost,
    assertExpectedFiles,
    createTestDocgeniContext,
    DEFAULT_TEST_ROOT_PATH,
    FixtureResult,
    loadFixture,
    updateContext,
    updateContextConfig
} from '../testing';
import AngularSitePlugin from './site-plugin';
import { toolkit } from '@docgeni/toolkit';
import * as systemPath from 'path';
import { getSystemPath, HostWatchEvent, HostWatchEventType, normalize, resolve } from '../fs';
import { of, Subject } from 'rxjs';
import { EventEmitter } from 'stream';
import { SpawnOptions } from 'child_process';

const SITE_TEMPLATE_PATH = resolve(__dirname, '../site-template');

const PUBLIC_PATH = `${DEFAULT_TEST_ROOT_PATH}/.docgeni/public`;
const DEFAULT_SITE_PATH = `${DEFAULT_TEST_ROOT_PATH}/.docgeni/site`;

describe('#site-plugin', () => {
    let ngSitePlugin: AngularSitePlugin;
    let context: DocgeniContext;
    let fixture: FixtureResult;

    beforeAll(async () => {
        toolkit.initialize({
            baseDir: systemPath.resolve(__dirname, '../')
        });
        fixture = await loadFixture('default-site');
    });

    beforeEach(() => {
        context = createTestDocgeniContext({
            initialFiles: {
                [`${DEFAULT_TEST_ROOT_PATH}/node_modules/@angular/core/package.json`]: fixture.src['package.json'],
                [`${DEFAULT_TEST_ROOT_PATH}/angular.json`]: fixture.src['angular.json'],
                [`${SITE_TEMPLATE_PATH}/src/main.ts`]: 'main.ts'
            }
        });
        ngSitePlugin = new AngularSitePlugin();
        ngSitePlugin.apply(context);
    });

    it('should create site success', async () => {
        await context.hooks.run.promise();
        await assertExpectedFiles(context.host, {
            [`${DEFAULT_SITE_PATH}/angular.json`]: fixture.getOutputContent('angular.json'),
            [`${DEFAULT_SITE_PATH}/tsconfig.app.json`]: fixture.getOutputContent('tsconfig.app.json'),
            [`${DEFAULT_SITE_PATH}/src/main.ts`]: 'main.ts'
        });
        expect(context.paths.absSitePath).toEqual(`${DEFAULT_TEST_ROOT_PATH}/.docgeni/site`);
        expect(context.paths.absSiteContentPath).toEqual(`${DEFAULT_SITE_PATH}/src/app/content`);
        expect(context.enableIvy).toBeTruthy();
    });

    it('should use custom site', async () => {
        context.config.siteProjectName = 'customSite';
        await context.hooks.run.promise();
        expect(await context.host.exists(`${DEFAULT_TEST_ROOT_PATH}/.docgeni/site`)).toBeFalsy();
        expect(context.paths.absSitePath).toEqual(`${DEFAULT_TEST_ROOT_PATH}/custom/site`);
        expect(context.paths.absSiteContentPath).toEqual(`${DEFAULT_TEST_ROOT_PATH}/custom/site/src/app/content`);
    });

    it('should watch custom site success', async () => {
        const sitePath = `${DEFAULT_TEST_ROOT_PATH}/custom/site`;
        context.config.siteProjectName = 'customSite';
        const watchAggregated$ = new Subject<HostWatchEvent[]>();

        updateContext(context, { watch: true });
        const watchAggregatedSpy = spyOn(context.host, 'watchAggregated');
        watchAggregatedSpy.and.callFake(files => {
            expect(files).toEqual([`${sitePath}/src/assets/stack-blitz`]);
            return watchAggregated$.asObservable();
        });
        await context.hooks.run.promise();
        const text1 = toolkit.strings.generateRandomId();
        await writeFilesToHost(context.host, {
            [`${sitePath}/src/assets/stack-blitz/a.txt`]: text1
        });
        expect(await context.host.exists(`${sitePath}/src/assets/stack-blitz/a.txt`)).toBeTruthy();
        watchAggregated$.next([
            {
                type: HostWatchEventType.Created,
                path: normalize(`${sitePath}/src/assets/stack-blitz/a.txt`),
                time: new Date()
            }
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
            [`${PUBLIC_PATH}/.browserslistrc`]: text2
        });

        await context.hooks.run.promise();

        assertExpectedFiles(context.host, {
            [`${DEFAULT_SITE_PATH}/tsconfig.app.json`]: `{"name": "test"}`,
            [`${DEFAULT_SITE_PATH}/.browserslistrc`]: text2,
            [`${DEFAULT_SITE_PATH}/src/index.html`]: html,
            [`${DEFAULT_SITE_PATH}/src/styles.scss`]: scss,
            [`${DEFAULT_SITE_PATH}/src/assets/1.txt`]: text1
        });
    });

    it('should watch public dir success', async () => {
        const watchAggregated$ = new Subject<HostWatchEvent[]>();
        await writeFilesToHost(context.host, {
            [`${PUBLIC_PATH}/tsconfig.json`]: `{"name": "test"}`,
            [`${PUBLIC_PATH}/assets/2.txt`]: `2.txt`
        });
        updateContext(context, { watch: true });
        const watchAggregatedSpy = spyOn(context.host, 'watchAggregated');
        watchAggregatedSpy.and.callFake(files => {
            expect(files).toEqual([
                `${PUBLIC_PATH}/assets`,
                `${PUBLIC_PATH}/styles.scss`,
                `${PUBLIC_PATH}/index.html`,
                `${PUBLIC_PATH}/favicon.ico`,
                `${PUBLIC_PATH}/.browserslistrc`,
                `${PUBLIC_PATH}/tsconfig.json`
            ]);
            return watchAggregated$.asObservable();
        });

        await context.hooks.run.promise();

        const text1 = toolkit.strings.generateRandomId();
        const text2 = toolkit.strings.generateRandomId();
        const html = toolkit.strings.generateRandomId();
        const scss = toolkit.strings.generateRandomId();
        await writeFilesToHost(context.host, {
            [`${PUBLIC_PATH}/tsconfig.json`]: `{"name": "test1"}`,
            [`${PUBLIC_PATH}/assets/1.txt`]: text1,
            [`${PUBLIC_PATH}/index.html`]: html,
            [`${PUBLIC_PATH}/styles.scss`]: scss,
            [`${PUBLIC_PATH}/.browserslistrc`]: text2
        });
        expect(await context.host.exists(`${DEFAULT_SITE_PATH}/src/assets/2.txt`)).toBeTruthy();
        expect(await context.host.exists(`${DEFAULT_SITE_PATH}/tsconfig.app.json`)).toBeTruthy();
        watchAggregated$.next([
            {
                type: HostWatchEventType.Created,
                path: normalize(`${PUBLIC_PATH}/index.html`),
                time: new Date()
            },
            {
                type: HostWatchEventType.Created,
                path: normalize(`${PUBLIC_PATH}/assets/1.txt`),
                time: new Date()
            },
            {
                type: HostWatchEventType.Deleted,
                path: normalize(`${PUBLIC_PATH}/assets/2.txt`),
                time: new Date()
            },
            {
                type: HostWatchEventType.Deleted,
                path: normalize(`${PUBLIC_PATH}/tsconfig.json`),
                time: new Date()
            }
        ]);

        await toolkit.utils.wait(2000);

        await assertExpectedFiles(context.host, {
            [`${DEFAULT_SITE_PATH}/src/index.html`]: html,
            [`${DEFAULT_SITE_PATH}/src/assets/1.txt`]: text1
        });
        expect(await context.host.exists(`${DEFAULT_SITE_PATH}/src/assets/2.txt`)).toBeFalsy();
        expect(await context.host.exists(`${DEFAULT_SITE_PATH}/tsconfig.app.json`)).toBeFalsy();
    });

    it('should add lib paths to tsconfig.json', async () => {
        updateContextConfig(context, {
            libs: [
                {
                    name: 'lib1',
                    rootDir: 'lib1-src'
                }
            ]
        });
        await writeFilesToHost(context.host, {
            [`${DEFAULT_TEST_ROOT_PATH}/lib1-src/package.json`]: `{"name": "@test/lib1"}`
        });
        await context.hooks.run.promise();
        expect(await context.host.exists(`${DEFAULT_SITE_PATH}/tsconfig.app.json`));
        const tsConfig = await context.host.readJSON<any>(`${DEFAULT_SITE_PATH}/tsconfig.app.json`);
        expect(tsConfig.compilerOptions.paths).toEqual({
            '@test/lib1/*': ['../../lib1-src/*'],
            '@test/lib1': ['../../lib1-src/index.ts', '../../lib1-src/public-api.ts']
        });
    });

    it('should exec angular command success', async () => {
        const deployUrl = `/${toolkit.strings.generateRandomId()}/`;
        updateContextConfig(context, { deployUrl: deployUrl });
        await context.hooks.run.promise();

        let calledSpawn = false;
        ngSitePlugin.siteBuilder.spawn = function(command: string, commandArgs: string[], options: SpawnOptions) {
            expect(command).toEqual('ng');
            expect(commandArgs).toEqual(['build', 'site', '--deploy-url', deployUrl]);
            expect(options).toEqual({
                stdio: 'inherit',
                cwd: getSystemPath(`${DEFAULT_TEST_ROOT_PATH}/.docgeni/site`),
                shell: process.platform === 'win32'
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
        await context.hooks.run.promise();

        let calledSpawn = false;
        ngSitePlugin.siteBuilder.spawn = function(command: string, commandArgs: string[], options: SpawnOptions) {
            expect(command).toEqual('ng');
            expect(commandArgs).toEqual(['build', 'customSite', '--deploy-url', deployUrl]);
            expect(options).toEqual({
                stdio: 'inherit',
                cwd: undefined,
                shell: process.platform === 'win32'
            });
            calledSpawn = true;
            return new EventEmitter();
        } as any;
        expect(calledSpawn).toEqual(false);
        await context.hooks.done.promise();
        expect(calledSpawn).toEqual(true);
    });
});
