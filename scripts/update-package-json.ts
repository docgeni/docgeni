import { toolkit } from '@docgeni/toolkit';
import * as path from 'path';
import writeJsonFile from 'write-json-file';

async function updatePackageJson(packageName: string, settings: any) {
    const templatePackageJsonPath = path.resolve(process.cwd(), `./dist/${packageName}/package.json`);
    const packageJson = await toolkit.fs.readJson(templatePackageJsonPath);
    Object.assign(packageJson, settings);
    await writeJsonFile(templatePackageJsonPath, packageJson, {
        detectIndent: true,
        indent: 2
    });
}

async function main() {
    await updatePackageJson('template', {
        private: false
    });
    toolkit.print.success(`update dist/template/package.json 's private to false success`);
    // await updatePackageJson('toolkit', {
    //     types: 'lib/index.d.ts'
    // });
    // toolkit.print.success(`update dist/toolkit/package.json 's types to lib/index.d.ts success`);
    // await updatePackageJson('core', {
    //     types: 'lib/index.d.ts'
    // });
    // toolkit.print.success(`update dist/core/package.json 's types to lib/index.d.ts success`);
}

main();
