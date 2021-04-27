import { CoreSchemaRegistry } from '@angular-devkit/core/src/json/schema/registry';
import { parseJsonSchemaToOptions } from '@angular/cli/utilities/json-schema';
import * as path from 'path';
import * as fs from 'fs';
export default async function main() {
    const registry = new CoreSchemaRegistry();
    const list = [
        {
            generatePath: 'packages/cli/src/ng-build-options.json',
            filePath: 'node_modules/@angular-devkit/build-angular/src/browser/schema.json'
        },
        {
            generatePath: 'packages/cli/src/ng-serve-options.json',
            filePath: 'node_modules/@angular-devkit/build-angular/src/dev-server/schema.json'
        }
    ];
    for (const item of list) {
        const options = await parseJsonSchemaToOptions(registry, require(path.resolve(process.cwd(), item.filePath)));
        fs.writeFileSync(path.resolve(process.cwd(), item.generatePath), JSON.stringify(options, undefined, 2));
    }
}
if (require.main === module) {
    main();
}
