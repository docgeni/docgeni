import { toolkit } from '@docgeni/toolkit';
import * as path from 'path';
import * as yargs from 'yargs-parser';
import writeJsonFile from 'write-json-file';

async function sync() {
    const args = yargs(process.argv);
    if (args.version) {
        const corePackageJsonPath = path.resolve(process.cwd(), './packages/core/package.json');
        const corePackageJson = await toolkit.fs.readJson(corePackageJsonPath);
        const toVersion = `^${args.version}`;
        corePackageJson.dependencies['@docgeni/template'] = toVersion;
        corePackageJson.peerDependencies['@docgeni/template'] = toVersion;
        await writeJsonFile(corePackageJsonPath, corePackageJson, {
            detectIndent: true,
            indent: 2
        });
        toolkit.print.info(`sync core/package.json 's @docgeni/template to ${toolkit.print.chalk.green(toVersion)}`);
    }
}

sync();
