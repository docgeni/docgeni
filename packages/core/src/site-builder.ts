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
            this.docgeni.paths.setSitePaths(sitePath);
            await this.createProject(sitePath);
        }
    }

    async createProject(sitePath: string): Promise<void> {
        await toolkit.fs.copy(path.resolve(__dirname, './site-template'), sitePath);
    }

    async start(): Promise<void> {
        if (this.siteProject) {
            this.execAngularCommand('serve');
        } else {
            this.docgeni.logger.warn(`not support start for auto create site`);
        }
    }

    async build(cmdArgs: AngularCommandOptions): Promise<void> {
        if (this.siteProject) {
            this.execAngularCommand('build', ['--prod', cmdArgs.prod ? 'true' : 'false']);
        } else {
            this.docgeni.logger.warn(`not support build for auto create site`);
        }
    }

    private execAngularCommand(command: string, args: Array<string> = []) {
        try {
            const commandArgs = [command, this.siteProject.name, ...args];
            this.docgeni.logger.info(`Start execute ng ${commandArgs.join(' ')} for site...`);
            const child = spawn('node_modules/@angular/cli/bin/ng', commandArgs, { stdio: 'inherit' });
            child.on('data', data => {
                this.docgeni.logger.error(data);
            });
        } catch (error) {
            this.docgeni.logger.error(error);
        }
    }
}
