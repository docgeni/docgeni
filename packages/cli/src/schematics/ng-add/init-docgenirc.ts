import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { NgAddSchema } from '../types/ng-add-schema';
import { getWorkspace } from '@schematics/angular/utility/config';
import { ProjectType, WorkspaceProject } from '@schematics/angular/utility/workspace-models';
import { DocgeniConfig } from '@docgeni/core/src/interfaces/config';
import { NavigationItem } from '@docgeni/core/src/interfaces/navigation-item';
import { Library } from '@docgeni/core/src/interfaces/library';

export class InitDocgenirc {
    private docgenirc: Partial<DocgeniConfig> = {};
    constructor(private options: NgAddSchema) {}
    private addProperty<T extends keyof DocgeniConfig>(key: T, value: DocgeniConfig[T]) {
        this.docgenirc[key] = value;
        return this;
    }

    private readAngularJson(host: Tree) {
        const angularJson = getWorkspace(host);
        const libraryProjects: [string, WorkspaceProject<ProjectType.Library>][] = Object.entries(angularJson.projects).filter(
            ([key, value]) => value.projectType === ProjectType.Library
        );
        const navs: Partial<NavigationItem>[] = [null];

        const libs: Partial<Library>[] = [];
        libraryProjects.forEach(([projectName, config]) => {
            navs.push({
                title: '组件',
                path: 'components',
                lib: projectName,
                locales: {}
            });
            libs.push({
                name: projectName,
                rootDir: config.sourceRoot,
                include: [],
                exclude: '',
                categories: []
            });
        });
        this.addProperty('libs', libs as Library[]);
        this.addProperty('navs', navs as NavigationItem[]);
    }

    private readPackageJson(host: Tree) {
        let packageJson: Record<string, any>;
        if (host.exists('package.json')) {
            packageJson = JSON.parse(host.read('package.json').toString());
        } else {
            return;
        }
        this.addProperty('title', packageJson.name || '');
        this.addProperty('repoUrl', (packageJson.repository && packageJson.repository.url) || '');
    }
    run() {
        this.addProperty('$schema', '@docgeni/cli/cli.schema.json');
        this.addProperty('mode', this.options.mode);
        this.addProperty('docsPath', this.options.docsPath);

        return (host: Tree, context: SchematicContext) => {
            this.readPackageJson(host);
            this.readAngularJson(host);
            host.create('.docgenirc.js', JSON.stringify(this.docgenirc));
            return host;
        };
    }
}
