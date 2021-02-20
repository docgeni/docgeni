import { SchematicContext, Tree, chain, Rule, noop } from '@angular-devkit/schematics';
import { getWorkspace, updateWorkspace } from '@schematics/angular/utility/workspace';
import { NodePackageInstallTask, RunSchematicTask } from '@angular-devkit/schematics/tasks';
import { JsonArray } from '@angular-devkit/core';
import { fetchPackageMetadata } from '@angular/cli/utilities/package-metadata';
import { getPackageManager } from '@angular/cli/utilities/package-manager';

import { addPackageToPackageJson, getPackageVersionFromPackageJson } from '../utils';
// import { DEPENDENCIES } from '../dependencies';
// import { VERSION } from '../version';
import { PackageManager } from '@angular/cli/lib/config/schema';
import { VERSION } from '../../version';

const CLI_PKG_NAME = '@docgeni/cli';

interface NgAddSchema {
    project?: string;
    icon?: boolean;
    animations?: boolean;
}

export function main(options: NgAddSchema = {}) {
    return async (host: Tree, context: SchematicContext) => {
        const packageManager = await getPackageManager(host.root.path);
        const usingYarn = packageManager === PackageManager.Yarn;

        const tethysVersionRange = getPackageVersionFromPackageJson(host, CLI_PKG_NAME);
        // The CLI inserts `ngx-tethys` into the `package.json` before this schematic runs.
        // This means that we do not need to insert ngx-tethys into `package.json` files again.
        // In some cases though, it could happen that this schematic runs outside of the CLI `ng add`
        // command, or ngx-tethys is only listed a dev dependency. If that is the case, we insert a
        // version based on the current build version (substituted version placeholder).
        if (tethysVersionRange === null) {
            addPackageToPackageJson(host, CLI_PKG_NAME, VERSION);
        }

        context.addTask(new NodePackageInstallTask());
        return chain([noop()]);
    };
}
