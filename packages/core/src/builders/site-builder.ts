import { DocgeniContext } from '../docgeni.interface';
import * as path from 'path';
import { toolkit } from '@docgeni/toolkit';
import { AngularJsonBuilder } from './angular-json-builder';
import { SiteProject } from '../types';

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
        from: '.browserslistrc',
        to: '.browserslistrc'
    },
    {
        from: 'tsconfig.json',
        to: 'tsconfig.app.json'
    }
];

export class SiteBuilder {
    private siteProject: SiteProject;

    constructor(private docgeni: DocgeniContext) {}

    async build(customSiteProject?: SiteProject): Promise<SiteProject> {
        if (customSiteProject) {
            this.siteProject = customSiteProject;
            this.docgeni.paths.setSitePaths(customSiteProject.root, customSiteProject.sourceRoot);
        } else {
            await this.createSiteProject();
            await this.syncPublic();
        }
        return this.siteProject;
    }

    private async createSiteProject(): Promise<void> {
        const sitePath = path.resolve(this.docgeni.paths.cwd, this.docgeni.config.siteDir);
        const siteProject: SiteProject = {
            name: 'site',
            root: sitePath,
            sourceRoot: path.resolve(sitePath, 'src')
        };
        this.siteProject = siteProject;
        this.docgeni.paths.setSitePaths(sitePath, siteProject.sourceRoot);

        if (!toolkit.fs.existsSync(path.resolve(sitePath, './src'))) {
            await toolkit.fs.copy(path.resolve(__dirname, '../site-template'), sitePath);
            await this.buildAngularJson();
        }
    }

    private async buildAngularJson() {
        await toolkit.fs.ensureFile(path.resolve(this.siteProject.root, './angular.json'));
        await toolkit.template.generate('angular-json.hbs', path.resolve(this.siteProject.root, './angular.json'), {
            root: this.docgeni.config.siteDir,
            outputPath: path.relative(this.docgeni.config.siteDir, this.docgeni.config.output)
        });
    }

    private async syncPublic() {
        if (!this.docgeni.config.publicDir) {
            return;
        }
        const publicDirPath = this.docgeni.paths.getAbsPath(this.docgeni.config.publicDir);
        if (toolkit.fs.existsSync(publicDirPath)) {
            await toolkit.fs.copy(path.resolve(publicDirPath, `assets`), path.resolve(this.siteProject.sourceRoot, 'assets'));

            for (const copyFile of COPY_FILES) {
                const fromPath = path.resolve(publicDirPath, copyFile.from);
                if (toolkit.fs.existsSync(fromPath)) {
                    await toolkit.fs.copy(fromPath, path.resolve(this.siteProject.root, copyFile.to), {});
                }
            }
        }
    }
}
