import { DocgeniContext } from './docgeni.interface';
import * as path from 'path';
import { toolkit } from '@docgeni/toolkit';
import { SiteProject } from './types';
import { ValidationError } from './errors';
import semver from 'semver';

export class Detector {
    ngVersion: string;

    siteProject: SiteProject;

    enableIvy: boolean;

    constructor(private docgeni: DocgeniContext) {}

    async detect() {
        const angularJsonPath = path.resolve(this.docgeni.paths.cwd, './angular.json');
        const angularCorePackageJsonPath = path.resolve(this.docgeni.paths.cwd, './node_modules/@angular/core/package.json');

        const hasAngularModule = await toolkit.fs.pathExists(angularCorePackageJsonPath);
        const hasAngularJson = await toolkit.fs.pathExists(angularJsonPath);

        if (hasAngularModule) {
            const angularCorePackageJson = toolkit.fs.readJSONSync(angularCorePackageJsonPath, { encoding: 'UTF-8' });
            this.ngVersion = angularCorePackageJson.version;
        }

        if (hasAngularJson) {
            const angularJson = toolkit.fs.readJSONSync(angularJsonPath, { encoding: 'UTF-8' });
            if (this.docgeni.config.siteProjectName) {
                const siteProject: SiteProject = angularJson.projects[this.docgeni.config.siteProjectName];
                if (siteProject) {
                    siteProject.name = this.docgeni.config.siteProjectName;
                    siteProject.custom = true;
                    this.siteProject = siteProject;
                }
            }
        }

        this.enableIvy = this.ngVersion ? semver.gte(this.ngVersion, '9.0.0') : true;

        if (this.docgeni.config.siteProjectName && !this.siteProject) {
            throw new ValidationError(`site project name(${this.docgeni.config.siteProjectName}) is not exists`);
        }
    }
}
