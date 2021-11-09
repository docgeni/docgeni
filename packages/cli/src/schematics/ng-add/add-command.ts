import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { parseJsonAst, JsonAstObject } from '@angular-devkit/core';
import { JSONFile } from '@schematics/angular/utility/json-file';
export class AddCommand {
    constructor() {}
    run() {
        return (host: Tree, context: SchematicContext) => {
            if (host.exists('package.json')) {
                const packageJson = new JSONFile(host, 'package.json');
                packageJson.modify(['scripts', 'start:docs'], `docgeni serve --port 4600`);
                packageJson.modify(['scripts', 'build:docs'], `docgeni build --prod`);
            }
            return host;
        };
    }
}
