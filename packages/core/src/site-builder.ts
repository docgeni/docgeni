import { DocgeniContext, SiteProject, AngularCommandOptions } from './docgeni.interface';
import * as path from 'path';
import { toolkit } from '@docgeni/toolkit';
import { spawn, exec, execSync } from 'child_process';

export class SiteBuilder {
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
        }
        this.siteProject = {
            name: 'site',
            root: sitePath
        };
        this.docgeni.paths.setSitePaths(sitePath);
    }

    async start(): Promise<void> {
        if (this.siteProject) {
            this.execAngularCommand('serve');
        } else {
            this.docgeni.logger.warn(`not support start for auto create site`);
        }
    }

    async build(cmdArgs: AngularCommandOptions): Promise<void> {
        this.execAngularCommand('build', ['--prod', cmdArgs.prod ? 'true' : 'false']);
    }

    private execAngularCommand(command: string, args: Array<string> = []) {
        try {
            const ngCommandPath = this.siteProject.custom ? 'node_modules/@angular/cli/bin/ng' : '../node_modules/@angular/cli/bin/ng';
            const commandArgs = [command, this.siteProject.name, ...args];
            this.docgeni.logger.info(`Start execute ng ${commandArgs.join(' ')} for site...`);
            const child = spawn(ngCommandPath, commandArgs, {
                stdio: 'inherit',
                cwd: this.siteProject.custom ? undefined : this.docgeni.paths.absSitePath
            });
            child.on('data', data => {
                this.docgeni.logger.info(data);
            });
        } catch (error) {
            this.docgeni.logger.error(error);
        }
    }
}
