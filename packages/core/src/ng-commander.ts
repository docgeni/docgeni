import { DocgeniContext, SiteProject, AngularCommandOptions } from './docgeni.interface';
import * as path from 'path';
import { toolkit } from '@docgeni/toolkit';
import { spawn, exec, execSync } from 'child_process';

const EXCLUDE_ARGS = ['skipSite'];

export class AngularCommander {
    private siteProject: SiteProject;

    constructor(private docgeni: DocgeniContext) {}

    async initialize(siteProject: SiteProject) {
        this.siteProject = siteProject;
        if (siteProject) {
            this.docgeni.paths.setSitePaths(siteProject.root, siteProject.sourceRoot);
        } else {
            const sitePath = path.resolve(this.docgeni.paths.cwd, '_site');
            await this.createSiteProject(sitePath);
        }
    }

    async createSiteProject(sitePath: string): Promise<void> {
        if (!toolkit.fs.existsSync(path.resolve(sitePath, './angular.json'))) {
            await toolkit.fs.copy(path.resolve(__dirname, './site-template'), sitePath);
            await this.updateSiteAngularJson(sitePath);
        }
        this.siteProject = {
            name: 'site',
            root: sitePath
        };
        this.docgeni.paths.setSitePaths(sitePath);
    }

    private async updateSiteAngularJson(sitePath: string) {
        const angularJsonPath = path.resolve(sitePath, './angular.json');
        const angularJson = toolkit.fs.readJSONSync(angularJsonPath, { encoding: 'UTF-8' });
        const siteProject = angularJson.projects.site;
        if (siteProject && siteProject.architect && siteProject.architect.build && siteProject.architect.build.options) {
            siteProject.architect.build.options.outputPath = this.docgeni.config.output;
        }
        await toolkit.fs.writeJSON(
            path.resolve(sitePath, './angular.json'),
            {
                ...angularJson,
                projects: {
                    ...angularJson.projects,
                    site: {
                        ...siteProject
                    }
                }
            },
            { spaces: 2 }
        );
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
