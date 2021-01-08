import { toolkit } from '@docgeni/toolkit';
import * as path from 'path';
import writeJsonFile from 'write-json-file';

async function update() {
    const templatePackageJsonPath = path.resolve(process.cwd(), './dist/template/package.json');
    const packageJson = await toolkit.fs.readJson(templatePackageJsonPath);
    packageJson.private = false;
    await writeJsonFile(templatePackageJsonPath, packageJson, {
        detectIndent: true,
        indent: 2
    });
    toolkit.print.succuss(`update dist/template/package.json 's private to false success`);
}

update();
