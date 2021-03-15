import { apply, mergeWith, move, renameTemplateFiles, SchematicContext, template, Tree, url } from '@angular-devkit/schematics';
import { NgAddSchema } from '../types/ng-add-schema';

export class CreateDocs {
    constructor(private options: NgAddSchema) {}
    run() {
        return (host: Tree, context: SchematicContext) => {
            return mergeWith(
                apply(url(`./template/docsPath`), [
                    template({
                        docsPath: this.options.docsPath
                    }),
                    renameTemplateFiles()
                ])
            );
        };
    }
}
