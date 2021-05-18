import { apply, mergeWith, move, renameTemplateFiles, SchematicContext, template, Tree, url } from '@angular-devkit/schematics';
import { NgAddSchema } from '../types/ng-add-schema';
import { getWorkspace } from '@schematics/angular/utility/config';
import { ProjectType, WorkspaceProject } from '@schematics/angular/utility/workspace-models';
import { DocgeniConfig } from '@docgeni/core/src/interfaces/config';
import { NavigationItem } from '@docgeni/core/src/interfaces/navigation-item';
import { Library } from '@docgeni/core/src/interfaces/library';
import stringifyObject from 'stringify-object';
export class InitDocgenirc {
    private docgenirc: Partial<DocgeniConfig> = {};
    constructor(private options: NgAddSchema) {}
    private addProperty<T extends keyof DocgeniConfig>(key: T, value: DocgeniConfig[T]) {
        if (!value) {
            return this;
        }
        this.docgenirc[key] = value;
        return this;
    }

    private buildPropertiesFromAngularJson(host: Tree) {
        if (!host.exists('angular.json') && !host.exists('.angular.json')) {
            return;
        }
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
                rootDir: config.root,
                include: ['src', 'src/lib'],
                exclude: '',
                categories: []
            });
        });
        this.addProperty('libs', libs as Library[]);
        this.addProperty('navs', navs as NavigationItem[]);
    }

    private buildPropertiesFromPackageJson(host: Tree) {
        let packageJson: Record<string, any>;
        if (host.exists('package.json')) {
            packageJson = JSON.parse(host.read('package.json').toString());
        } else {
            return;
        }
        this.addProperty('title', packageJson.name || '');
        this.addProperty('repoUrl', (packageJson.repository && packageJson.repository.url) || '');
        this.addProperty('description', packageJson.description || '');
    }

    run() {
        this.addProperty('mode', this.options.mode);
        this.addProperty('docsDir', this.options.docsDir);

        return (host: Tree, context: SchematicContext) => {
            this.buildPropertiesFromPackageJson(host);
            this.buildPropertiesFromAngularJson(host);

            return mergeWith(
                apply(url(`./template/docgenicrc`), [
                    template({
                        config: this.docgenirc,
                        util: {
                            stringify: (content, indent: number, parentIndent) => {
                                return stringifyObject(content, { indent: ' '.repeat(indent) }).replace(
                                    /(\r\n|\n\r|\n|\r)/g,
                                    `$1${' '.repeat(parentIndent)}`
                                );
                            }
                        }
                    }),
                    renameTemplateFiles()
                ])
            );
        };
    }
}
