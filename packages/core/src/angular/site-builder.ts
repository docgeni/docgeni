import { DocgeniContext } from '../docgeni.interface';
import * as path from 'path';
import { toolkit } from '@docgeni/toolkit';
import { AngularCommandOptions, SiteProject } from './types';
import Handlebars from 'handlebars';
import { getSystemPath, HostWatchEventType, normalize, relative, resolve } from '../fs';
import { of, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ValidationError } from '../errors';
import semver from 'semver';
import { spawn } from 'child_process';
import { SITE_ASSETS_RELATIVE_PATH } from '../constants';

interface CopyFile {
    from: string;
    to: string;
}

const COPY_FILES: CopyFile[] = [
    {
        from: 'styles.scss',
        to: 'src/styles.scss'
    },
    {
        from: 'index.html',
        to: 'src/index.html'
    },
    {
        from: 'favicon.ico',
        to: 'src/favicon.ico'
    },
    {
        from: '.browserslistrc',
        to: '.browserslistrc'
    },
    {
        from: 'tsconfig.json',
        to: 'tsconfig.app.json'
    }
];

export class SiteBuilder {
    public ngVersion: string;
    public enableIvy: boolean;
    private publicDirPath: string;
    private siteProject: SiteProject;

    spawn = spawn;

    static create(docgeni: DocgeniContext) {
        return new SiteBuilder(docgeni);
    }

    constructor(private docgeni: DocgeniContext) {
        if (this.docgeni.config.publicDir) {
            this.publicDirPath = this.docgeni.paths.getAbsPath(this.docgeni.config.publicDir);
        }
    }

    public async build() {
        await this.detect();
        if (this.siteProject) {
            this.docgeni.paths.setSitePaths(this.siteProject.root, this.siteProject.sourceRoot);
            await this.syncSiteProject();
            this.watchSiteProject();
        } else {
            await this.createSiteProject();
            await this.syncPublic();
            this.watchPublic();
        }
    }

    public async runNgCommand(cmdOptions: AngularCommandOptions) {
        const argv = this.parseCommandOptionsToArgs(cmdOptions);
        await this.execAngularCommand(this.docgeni.watch ? 'serve' : 'build', argv);
    }

    private async detect() {
        const angularJsonPath = this.docgeni.paths.getAbsPath('./angular.json');
        const angularCorePackageJsonPath = this.docgeni.paths.getAbsPath('./node_modules/@angular/core/package.json');

        if (await this.docgeni.host.exists(angularCorePackageJsonPath)) {
            const angularCorePackageJson = await this.docgeni.host.readJSON<{ version: string }>(angularCorePackageJsonPath);
            this.ngVersion = angularCorePackageJson.version;
        }

        if (this.docgeni.config.siteProjectName && (await this.docgeni.host.exists(angularJsonPath))) {
            const angularJson = await this.docgeni.host.readJSON<{ projects: Record<string, SiteProject> }>(angularJsonPath);
            const siteProject: SiteProject = angularJson.projects[this.docgeni.config.siteProjectName];
            if (siteProject) {
                siteProject.name = this.docgeni.config.siteProjectName;
                siteProject.custom = true;
                this.siteProject = siteProject;
            }
        }

        this.enableIvy = this.ngVersion ? semver.gte(this.ngVersion, '9.0.0') : true;

        if (this.docgeni.config.siteProjectName && !this.siteProject) {
            throw new ValidationError(`site project name(${this.docgeni.config.siteProjectName}) is not exists`);
        }
    }

    private async createSiteProject(): Promise<void> {
        const sitePath = resolve(this.docgeni.paths.cwd, this.docgeni.config.siteDir);
        const siteProject: SiteProject = {
            name: 'site',
            root: sitePath,
            sourceRoot: resolve(sitePath, 'src')
        };
        this.siteProject = siteProject;
        this.docgeni.paths.setSitePaths(sitePath, siteProject.sourceRoot);
        await this.docgeni.host.copy(resolve(__dirname, '../site-template'), sitePath);
        const angularJSONPath = resolve(this.siteProject.root, './angular.json');
        const angularJSONContent = toolkit.template.compile('angular-json.hbs', {
            root: this.docgeni.config.siteDir,
            outputPath: normalize(path.relative(this.docgeni.config.siteDir, this.docgeni.config.outputDir))
        });
        await this.docgeni.host.writeFile(angularJSONPath, angularJSONContent);
        await this.syncTsconfig();
    }

    private async syncTsconfig() {
        const tsPaths: { key: string; value: Handlebars.SafeString }[] = [];
        for (const lib of this.docgeni.config.libs || []) {
            const packageJsonPath = this.docgeni.paths.getAbsPath(`${lib.rootDir}/package.json`);
            if (!(await this.docgeni.host.exists(packageJsonPath))) {
                throw new ValidationError(
                    `Can't find package.json in ${lib.name} lib's rootDir(${lib.rootDir}), please check the configuration of rootDir`
                );
            }
            const packageJson = await this.docgeni.host.readJSON<{ name: string }>(packageJsonPath);
            tsPaths.push(
                {
                    key: `${packageJson.name}/*`,
                    value: new Handlebars.SafeString(
                        [`"${relative(this.siteProject.root, resolve(this.docgeni.paths.cwd, lib.rootDir))}/*"`].join(',')
                    )
                },
                {
                    key: packageJson.name,
                    value: new Handlebars.SafeString(
                        [
                            `"${relative(this.siteProject.root, resolve(this.docgeni.paths.cwd, lib.rootDir))}/index.ts"`,
                            `"${relative(this.siteProject.root, resolve(this.docgeni.paths.cwd, lib.rootDir))}/public-api.ts"`
                        ].join(',')
                    )
                }
            );
        }
        const tsconfigJsonPath = resolve(this.siteProject.root, './tsconfig.app.json');
        const tsconfigJsonContent = toolkit.template.compile('tsconfig-app-json.hbs', {
            paths: tsPaths
        });
        await this.docgeni.host.writeFile(tsconfigJsonPath, tsconfigJsonContent);
    }

    private async publicDirExists() {
        if (this.publicDirPath) {
            const result = await this.docgeni.host.exists(this.publicDirPath);
            return result;
        }
        return false;
    }

    private async syncPublic() {
        if (await this.publicDirExists()) {
            const assetsPath = resolve(this.publicDirPath, `assets`);
            if (await this.docgeni.host.pathExists(assetsPath)) {
                await this.docgeni.host.copy(assetsPath, resolve(this.siteProject.sourceRoot, 'assets'));
            }
            for (const copyFile of COPY_FILES) {
                const fromPath = resolve(this.publicDirPath, copyFile.from);
                if (await this.docgeni.host.pathExists(fromPath)) {
                    await this.docgeni.host.copy(fromPath, resolve(this.siteProject.root, copyFile.to));
                }
            }
            this.updateShareExampleBundleJson(this.publicDirPath);
        }
    }

    private async watchPublic() {
        if (this.docgeni.watch && (await this.publicDirExists())) {
            const assetsPath = resolve(this.publicDirPath, 'assets');

            const fromToMap = new Map<string, string>();
            const watchFilePaths: string[] = [];
            COPY_FILES.forEach(copyFile => {
                const fromPath = resolve(this.publicDirPath, copyFile.from);
                const toPath = resolve(this.siteProject.root, copyFile.to);
                fromToMap.set(fromPath, toPath);
                watchFilePaths.push(fromPath);
            });
            this.docgeni.host.watchAggregated([assetsPath, ...watchFilePaths]).subscribe(async events => {
                for (const event of events) {
                    let distPath: string;
                    if (fromToMap.get(event.path)) {
                        distPath = fromToMap.get(event.path);
                    } else {
                        distPath = resolve(this.siteProject.sourceRoot, relative(this.publicDirPath, event.path));
                    }
                    if (event.type === HostWatchEventType.Deleted) {
                        await this.docgeni.host.delete(distPath);
                    } else {
                        await this.docgeni.host.copy(event.path, distPath);
                    }
                }
                const isStackBlitzDir = events.some(event => !relative(resolve(assetsPath, 'stack-blitz'), event.path).startsWith('..'));
                if (isStackBlitzDir) {
                    this.updateShareExampleBundleJson(this.publicDirPath);
                }
            });
        }
    }

    private async syncSiteProject() {
        this.updateShareExampleBundleJson(resolve(this.docgeni.paths.absSitePath, 'src'));
    }

    private async watchSiteProject() {
        if (this.docgeni.watch) {
            const sourceRoot = resolve(this.docgeni.paths.absSitePath, 'src');
            const assetsPath = resolve(sourceRoot, 'assets');
            this.docgeni.host.watchAggregated([`${assetsPath}/stack-blitz`]).subscribe(async events => {
                const isStackBlitzDir = events.some(event => !event.path.endsWith('stack-blitz/bundle.json'));
                if (isStackBlitzDir) {
                    this.updateShareExampleBundleJson(sourceRoot);
                }
            });
        }
    }

    private async execAngularCommand(command: string, args: Array<string> = []) {
        try {
            const commandArgs = [command, this.siteProject.name, ...args];
            const commandCwd = this.siteProject.custom ? undefined : getSystemPath(this.docgeni.paths.absSitePath);
            this.docgeni.logger.fancy(`\nStart run ${toolkit.print.colors.blueBright(`ng ${commandArgs.join(' ')}`)} for site...`);
            const child = this.spawn('ng', commandArgs, {
                stdio: 'inherit',
                cwd: commandCwd,
                shell: process.platform === 'win32' // 仅在当前运行环境为 Windows 时，才使用 shell
            });
            child.on('data', data => {
                this.docgeni.logger.info(data);
            });
            child.on('exit', (code, signal) => {
                if (code) {
                    throw new Error(`Child exited with code ${code}`);
                }
                if (signal) {
                    throw new Error(`Child was killed with signal ${signal}`);
                }
            });
        } catch (error) {
            this.docgeni.logger.error(error);
        }
    }

    private parseCommandOptionsToArgs(cmdOptions: AngularCommandOptions) {
        return Object.keys(cmdOptions)
            .filter(key => {
                return !toolkit.utils.isUndefinedOrNull(cmdOptions[key]);
            })
            .reduce((result, key) => {
                return [...result, `--${key}`, cmdOptions[key]];
            }, []);
    }

    private async updateShareExampleBundleJson(sitePath: string) {
        const sharedExampleDir = resolve(resolve(sitePath, 'assets'), 'stack-blitz');
        if (!(await this.docgeni.host.exists(sharedExampleDir))) {
            await this.docgeni.host.writeFile(resolve(this.siteProject.root, `${SITE_ASSETS_RELATIVE_PATH}/stack-blitz/bundle.json`), `[]`);
            return;
        }
        const files = await this.docgeni.host.getFiles(sharedExampleDir, { recursively: true });
        const list = [];
        for (const file of files) {
            if (file === 'bundle.json') {
                continue;
            }
            list.push({ path: file, content: await this.docgeni.host.readFile(resolve(sharedExampleDir, file)) });
        }
        const content = JSON.stringify(list);
        await this.docgeni.host.writeFile(
            resolve(this.docgeni.paths.absSitePath, `${SITE_ASSETS_RELATIVE_PATH}/stack-blitz/bundle.json`),
            content
        );
    }
}
