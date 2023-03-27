import { apply, mergeWith, move, renameTemplateFiles, SchematicContext, template, Tree, url } from '@angular-devkit/schematics';
import { NgAddSchema } from '../types/ng-add-schema';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { ProjectType, WorkspaceProject } from '@schematics/angular/utility/workspace-models';
import { DocgeniConfig, DocgeniLibrary, DocgeniNavItem } from '@docgeni/core';
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

    private async buildPropertiesFromAngularJson(host: Tree) {
        if (!host.exists('angular.json') && !host.exists('.angular.json')) {
            return;
        }
        const workspace = await getWorkspace(host);
        const libraryProjects = Array.from(workspace.projects.entries()).filter(([key, value]) => {
            return value.extensions.projectType === ProjectType.Library;
        });
        const navs: Partial<DocgeniNavItem>[] = [null];

        const libs: Partial<DocgeniLibrary>[] = [];
        libraryProjects.forEach(([projectName, config]) => {
            navs.push({
                title: 'Components',
                path: 'components',
                lib: projectName,
                locales: {}
            });
            libs.push({
                name: projectName,
                rootDir: config.root,
                include: ['src', 'src/lib'],
                apiMode: 'automatic',
                categories: []
            });
        });
        this.addProperty('libs', libs as DocgeniLibrary[]);
        this.addProperty('navs', navs as DocgeniNavItem[]);
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

        return async (host: Tree, context: SchematicContext) => {
            this.buildPropertiesFromPackageJson(host);
            await this.buildPropertiesFromAngularJson(host);

            return mergeWith(
                apply(url(`./template/docgenicrc`), [
                    template({
                        config: this.docgenirc,
                        util: {
                            stringify: (content: string, indent: number, parentIndent: number) => {
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
