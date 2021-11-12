import { SchematicContext, Tree, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addPackageJsonDependency, NodeDependencyType, removePackageJsonDependency } from '@schematics/angular/utility/dependencies';
import { NgAddSchema } from '../types/ng-add-schema';
import { InitDocgenirc } from './init-docgenirc';
import { CreateDocs } from './create-docs';
import { AddCommand } from './add-command';
import { ANGULAR_VERSION, VERSION } from '../../version';
import { AddGitignore } from './add-gitignore';

function addDependenciesToPackageJson() {
    return (host: Tree, context: SchematicContext) => {
        const dependencies = [
            {
                type: NodeDependencyType.Dev,
                name: '@docgeni/template',
                version: VERSION
            },
            {
                type: NodeDependencyType.Dev,
                name: '@docgeni/cli',
                version: VERSION
            }
        ];
        const docgeniAngular = {
            type: NodeDependencyType.Dev,
            name: '@docgei/angular',
            version: ANGULAR_VERSION
        };
        if (host.exists('/package.json')) {
            const packageJsonContent = host.read('/package.json').toString();
            const packageJson = JSON.parse(packageJsonContent);
            if (!packageJson?.devDependencies['@docgei/angular'] && !packageJson?.dependencies['@angular/core']) {
                dependencies.push(docgeniAngular);
            }
        } else {
            dependencies.push(docgeniAngular);
        }

        dependencies.forEach(dependency => addPackageJsonDependency(host, dependency));

        context.addTask(new NodePackageInstallTask());

        return host;
    };
}

export default function main(options: NgAddSchema) {
    return async (host: Tree, context: SchematicContext) => {
        return chain([
            addDependenciesToPackageJson(),
            new InitDocgenirc(options).run(),
            new CreateDocs(options).run(),
            new AddCommand().run(),
            new AddGitignore().run()
        ]);
    };
}
