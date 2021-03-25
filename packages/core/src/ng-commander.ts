import { DocgeniContext, SiteProject, AngularCommandOptions } from './docgeni.interface';
import * as path from 'path';
import { toolkit } from '@docgeni/toolkit';
import { spawn, exec, execSync } from 'child_process';
import { AngularJsonBuilder } from './builders';

const EXCLUDE_ARGS = ['skipSite'];

export class AngularCommander {
    private siteProject: SiteProject;

    constructor(private docgeni: DocgeniContext) {}

    async initialize(siteProject: SiteProject) {
        this.siteProject = siteProject;
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
        await this.execAngularCommand('serve', this.parseCommandOptionsToArgs(cmdOptions));
    }

    async build(cmdOptions: AngularCommandOptions): Promise<void> {
        await this.execAngularCommand('build', this.parseCommandOptionsToArgs(cmdOptions));
    }

    private async execAngularCommand(command: string, args: Array<string> = []) {
        try {
            const projectLocalCli = require.resolve('@angular/cli', { paths: [process.cwd()] });
            const ngCommandPath = projectLocalCli.replace(`/lib/cli/index.js`, `/bin/ng`);
            // const cli = await Promise.resolve().then(() => require(projectLocalCli));
            const commandArgs = [command, this.siteProject.name, ...args];
            const commandCwd = this.siteProject.custom ? undefined : this.docgeni.paths.absSitePath;
            this.docgeni.logger.info(`Start execute ng ${commandArgs.join(' ')} for site...`);
            // await cli.default({
            //     cliArgs: commandArgs,
            //     cwd: this.siteProject.custom ? undefined : this.docgeni.paths.absSitePath
            // });
            // const ngCommandPath = this.siteProject.custom ? 'node_modules/@angular/cli/bin/ng' : '../node_modules/@angular/cli/bin/ng';
            console.log(ngCommandPath, commandCwd);
            const child = spawn(ngCommandPath, commandArgs, {
                stdio: 'inherit',
                cwd: commandCwd,
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
