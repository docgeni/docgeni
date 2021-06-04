import { DocgeniContext } from '../docgeni.interface';
import * as path from 'path';
import { toolkit } from '@docgeni/toolkit';
import { SiteProject } from '../types';
import Handlebars from 'handlebars';
import { normalize, relative, resolve, virtualFs } from '@angular-devkit/core';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ValidationError } from '../errors';
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
            this.watchPublic();
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
        await toolkit.fs.copy(path.resolve(__dirname, '../site-template'), sitePath, { overwrite: true });
        await this.buildAngularJson();
        await this.addTsconfigPaths();
    }

    private async buildAngularJson() {
        await toolkit.fs.ensureFile(path.resolve(this.siteProject.root, './angular.json'));
        await toolkit.template.generate('angular-json.hbs', path.resolve(this.siteProject.root, './angular.json'), {
            root: this.docgeni.config.siteDir,
            outputPath: normalize(path.relative(this.docgeni.config.siteDir, this.docgeni.config.outputDir))
        });
    }

    private async addTsconfigPaths() {
        const getLibraryName = (rootDir: string, libName: string) => {
            const packageJsonPath = path.join(this.docgeni.paths.cwd, rootDir, 'package.json');
            if (!toolkit.fs.existsSync(packageJsonPath)) {
                throw new ValidationError(
                    `Can't find package.json in ${libName} lib's rootDir(${rootDir}), please check the configuration of rootDir`
                );
            }
            const packageJson = toolkit.fs.readJsonSync(packageJsonPath);
            return packageJson.name;
        };
        const paths = (this.docgeni.config.libs || [])
            .map(item => [
                {
                    key: `${getLibraryName(item.rootDir, item.name)}/*`,
                    value: new Handlebars.SafeString(
                        [`"${path.relative(this.siteProject.root, path.resolve(this.docgeni.paths.cwd, item.rootDir))}/*"`].join(',')
                    )
                },
                {
                    key: `${getLibraryName(item.rootDir, item.name)}`,
                    value: new Handlebars.SafeString(
                        [
                            `"${path.relative(this.siteProject.root, path.resolve(this.docgeni.paths.cwd, item.rootDir))}/index.ts"`,
                            `"${path.relative(this.siteProject.root, path.resolve(this.docgeni.paths.cwd, item.rootDir))}/public-api.ts"`
                        ].join(',')
                    )
                }
            ])
            .reduce((list, item) => {
                list.push(...item);
                return list;
            }, []);
        await toolkit.fs.ensureFile(path.resolve(this.siteProject.root, './tsconfig.app.json'));
        await toolkit.template.generate('tsconfig-app-json.hbs', path.resolve(this.siteProject.root, './tsconfig.app.json'), {
            paths
        });
    }

    private async syncPublic() {
        if (!this.docgeni.config.publicDir) {
            return;
        }

        const publicDirPath = this.docgeni.paths.getAbsPath(this.docgeni.config.publicDir);
        if (toolkit.fs.existsSync(publicDirPath)) {
            const assetsPath = path.resolve(publicDirPath, `assets`);
            if (toolkit.fs.existsSync(assetsPath)) {
                await toolkit.fs.copy(assetsPath, path.resolve(this.siteProject.sourceRoot, 'assets'));
            }
            for (const copyFile of COPY_FILES) {
                const fromPath = path.resolve(publicDirPath, copyFile.from);
                if (toolkit.fs.existsSync(fromPath)) {
                    await toolkit.fs.copy(fromPath, path.resolve(this.siteProject.root, copyFile.to), {});
                }
            }
        }
    }

    async watchPublic() {
        if (this.docgeni.watch) {
            const publicDirPath = this.docgeni.paths.getAbsPath(this.docgeni.config.publicDir);

            if (await this.docgeni.host.pathExists(publicDirPath)) {
                const assetsPath = resolve(normalize(this.docgeni.config.publicDir), normalize('assets'));
                if (toolkit.fs.existsSync(assetsPath)) {
                    this.docgeni.host
                        .watch(normalize(assetsPath))
                        .pipe(
                            switchMap((value: virtualFs.HostWatchEvent) => {
                                const publicFilePath = resolve(
                                    normalize(this.siteProject.sourceRoot),
                                    relative(normalize(publicDirPath), normalize(value.path))
                                );
                                if (value.type === virtualFs.HostWatchEventType.Deleted) {
                                    this.docgeni.host.delete(publicFilePath);
                                } else {
                                    this.docgeni.host.copy(value.path, publicFilePath);
                                }
                                return of(value);
                            })
                        )
                        .subscribe();
                }

                for (const copyFile of COPY_FILES) {
                    const fromPath = resolve(normalize(this.docgeni.config.publicDir), normalize(copyFile.from));

                    this.docgeni.host
                        .watch(normalize(fromPath))
                        .pipe(
                            switchMap((value: virtualFs.HostWatchEvent) => {
                                const publicFilePath = resolve(normalize(this.docgeni.config.siteDir), normalize(copyFile.to));
                                if (value.type === virtualFs.HostWatchEventType.Deleted) {
                                    this.docgeni.host.delete(publicFilePath);
                                } else {
                                    this.docgeni.host.copy(value.path, publicFilePath);
                                }
                                return of(value);
                            })
                        )
                        .subscribe();
                }
            }
        }
    }
}
