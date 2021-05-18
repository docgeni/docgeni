import { DocgeniContext } from '../docgeni.interface';
import * as path from 'path';
import { toolkit } from '@docgeni/toolkit';
import { SiteProject } from '../types';
import Handlebars from 'handlebars';
import * as chokidar from 'chokidar';
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

        if (!toolkit.fs.existsSync(path.resolve(sitePath, './src'))) {
            await toolkit.fs.copy(path.resolve(__dirname, '../site-template'), sitePath);
            await this.buildAngularJson();
            await this.addTsconfigPaths();
        }
    }

    private async buildAngularJson() {
        await toolkit.fs.ensureFile(path.resolve(this.siteProject.root, './angular.json'));
        await toolkit.template.generate('angular-json.hbs', path.resolve(this.siteProject.root, './angular.json'), {
            root: this.docgeni.config.siteDir,
            outputPath: path.relative(this.docgeni.config.siteDir, this.docgeni.config.outputDir)
        });
    }

    private async addTsconfigPaths() {
        const getLibraryName = (rootDir: string) => {
            const packageJsonPath = path.join(this.docgeni.paths.cwd, rootDir, 'package.json');
            const packageJson = toolkit.fs.readJsonSync(packageJsonPath);
            return packageJson.name;
        };
        const paths = (this.docgeni.config.libs || [])
            .map(item => [
                {
                    key: `${getLibraryName(item.rootDir)}/*`,
                    value: new Handlebars.SafeString(
                        [`"${path.relative(this.siteProject.root, path.resolve(this.docgeni.paths.cwd, item.rootDir))}/*"`].join(',')
                    )
                },
                {
                    key: `${getLibraryName(item.rootDir)}`,
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

    private watchPublic() {
        const watchedPaths: string[] = [];
        const publicDirPath = this.docgeni.paths.getAbsPath(this.docgeni.config.publicDir);
        if (toolkit.fs.existsSync(publicDirPath)) {
            const assetsPath = path.resolve(publicDirPath, `assets`);
            if (toolkit.fs.existsSync(assetsPath)) {
                watchedPaths.push(assetsPath);
            }

            for (const copyFile of COPY_FILES) {
                const fromPath = path.resolve(publicDirPath, copyFile.from);
                if (toolkit.fs.existsSync(fromPath)) {
                    watchedPaths.push(fromPath);
                }
            }
        }

        const watcher = chokidar.watch(watchedPaths, { ignoreInitial: true, interval: 1000 });
        ['add', 'change'].forEach(eventName => {
            watcher.on(eventName, async (event, filePath) => {
                await this.syncPublic();
            });
        });
    }
}
