import { DocgeniContext, SiteProject } from './docgeni.interface';
import * as path from 'path';
import { toolkit } from '@docgeni/toolkit';

export class Detector {
    angularVersion: string;

    siteProject: SiteProject;

    constructor(private docgeni: DocgeniContext) {}

    async detect() {
        const angularJsonPath = path.resolve(this.docgeni.paths.cwd, './angular.json');
        const angularCorePackageJsonPath = path.resolve(this.docgeni.paths.cwd, './node_modules/@angular/core/package.json');

        const hasAngularModule = await toolkit.fs.pathExists(angularCorePackageJsonPath);
        const hasAngularJson = await toolkit.fs.pathExists(angularJsonPath);

        if (hasAngularModule) {
            const angularCorePackageJson = toolkit.fs.readJSONSync(angularCorePackageJsonPath, { encoding: 'UTF-8' });
            this.angularVersion = angularCorePackageJson.version;
        }

        if (hasAngularJson) {
            const angularJson = toolkit.fs.readJSONSync(angularJsonPath, { encoding: 'UTF-8' });
            if (this.docgeni.config.siteProjectName) {
                const siteProject = angularJson.projects[this.docgeni.config.siteProjectName];
                if (siteProject) {
                    siteProject.name = this.docgeni.config.siteProjectName;
                    this.siteProject = siteProject;
                }
            }
        }
    }
}
