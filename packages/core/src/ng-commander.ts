import { DocgeniContext, SiteProject, AngularCommandOptions } from './docgeni.interface';
import * as path from 'path';
import { toolkit } from '@docgeni/toolkit';
import { spawn, exec, execSync } from 'child_process';
import { AngularJsonBuilder } from './builders/angular-json-builder';

const EXCLUDE_ARGS = ['skipSite'];

export class AngularCommander {
    private siteProject: SiteProject;

    constructor(private docgeni: DocgeniContext) {}

    async initialize(siteProject: SiteProject) {
        this.siteProject = siteProject;
        if (siteProject) {
            this.docgeni.paths.setSitePaths(siteProject.root, siteProject.sourceRoot);
        } else {
            const sitePath = path.resolve(this.docgeni.paths.cwd, this.docgeni.config.siteDir);
            await this.createSiteProject(sitePath);
        }
    }

    async createSiteProject(sitePath: string): Promise<void> {
        if (!toolkit.fs.existsSync(path.resolve(sitePath, './src'))) {
            await toolkit.fs.copy(path.resolve(__dirname, './site-template'), sitePath);
            await this.emitAngularJson(sitePath);
        }
        this.siteProject = {
            name: 'site',
            root: sitePath
        };
        this.docgeni.paths.setSitePaths(sitePath);
    }

    private async emitAngularJson(sitePath: string) {
        const angularJsonBuilder = new AngularJsonBuilder(this.docgeni);
        angularJsonBuilder.hooks.buildAngularJsonSucceed.tap('EmitAngularJson', async builder => {
            await builder.emit();
        });
        await angularJsonBuilder.build();
    }

    private parseCommandOptionsToArgs(cmdOptions: AngularCommandOptions) {
        return Object.keys(cmdOptions)
            .filter(key => {
                return !toolkit.utils.isUndefinedOrNull(cmdOptions[key]) && !EXCLUDE_ARGS.includes(key);
            })
            .reduce((result, key) => {
                return [...result, `--${key}`, cmdOptions[key]];
            }, []);
    }

    async serve(cmdOptions: AngularCommandOptions): Promise<void> {
        this.execAngularCommand('serve', this.parseCommandOptionsToArgs(cmdOptions));
    }

    async build(cmdOptions: AngularCommandOptions): Promise<void> {
        this.execAngularCommand('build', this.parseCommandOptionsToArgs(cmdOptions));
    }

    private execAngularCommand(command: string, args: Array<string> = []) {
        try {
            const ngCommandPath = this.siteProject.custom ? 'node_modules/@angular/cli/bin/ng' : '../node_modules/@angular/cli/bin/ng';
            const commandArgs = [command, this.siteProject.name, ...args];
            this.docgeni.logger.info(`Start execute ng ${commandArgs.join(' ')} for site...`);
            const child = spawn(ngCommandPath, commandArgs, {
                stdio: 'inherit',
                cwd: this.siteProject.custom ? undefined : this.docgeni.paths.absSitePath,
                shell: process.platform === 'win32' // 仅在当前运行环境为 Windows 时，才使用 shell
            });
            child.on('data', data => {
                this.docgeni.logger.info(data);
            });
        } catch (error) {
            this.docgeni.logger.error(error);
        }
    }
}
