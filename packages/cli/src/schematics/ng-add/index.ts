import { SchematicContext, Tree, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addPackageJsonDependency, NodeDependencyType, removePackageJsonDependency } from '@schematics/angular/utility/dependencies';
import { NgAddSchema } from '../types/ng-add-schema';
import { InitDocgenirc } from './init-docgenirc';
import { CreateDocs } from './create-docs';
import { AddCommand } from './add-command';
import { VERSION } from '../../version';
function addDependenciesToPackageJson() {
    return (host: Tree, context: SchematicContext) => {
        ['@docgeni/cli'].forEach(dependency => removePackageJsonDependency(host, dependency));
        [
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
        ].forEach(dependency => addPackageJsonDependency(host, dependency));

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
            new AddCommand().run()
        ]);
    };
}
