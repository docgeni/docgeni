import { SchematicContext, Tree } from '@angular-devkit/schematics';

export class AddGitignore {
    constructor() {}
    run() {
        return (host: Tree, context: SchematicContext) => {
            const fileName = `.gitignore`;
            const appendContent = `.docgeni/site`;
            if (!host.exists(fileName)) {
                host.create(fileName, appendContent);
            } else {
                const content = host.read(fileName).toString();
                const recorder = host.beginUpdate(fileName);
                recorder.insertRight(content.length, appendContent);
                host.commitUpdate(recorder);
            }
            return host;
        };
    }
}
