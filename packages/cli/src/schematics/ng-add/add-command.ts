import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { parseJsonAst } from '@angular-devkit/core/src/json/parser';
import { appendPropertyInAstObject, findPropertyInAstObject } from '@schematics/angular/utility/json-utils';
import { JsonAstObject } from '@angular-devkit/core';
export class AddCommand {
    constructor() {}
    run() {
        return (host: Tree, context: SchematicContext) => {
            if (host.exists('package.json')) {
                const content = host.read('package.json').toString();
                const ast = parseJsonAst(content) as JsonAstObject;
                const scriptNode = findPropertyInAstObject(ast, 'scripts') as JsonAstObject;
                const recorder = host.beginUpdate('package.json');
                appendPropertyInAstObject(recorder, scriptNode, 'start:docs', `docgeni serve --port 4600`, 4);
                appendPropertyInAstObject(recorder, scriptNode, 'build:docs', `docgeni build --prod`, 4);
                host.commitUpdate(recorder);
            }
            return host;
        };
    }
}
