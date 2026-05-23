import { toolkit } from '@docgeni/toolkit';
import * as path from 'path';
import writeJsonFile from 'write-json-file';

const LIB_PACKAGES = ['cli', 'core', 'ngdoc', 'toolkit'] as const;
const COPY_FILES = ['package.json', 'README.md', 'CHANGELOG.md'] as const;

const PACKAGE_EXPORTS = {
    '.': {
        types: './index.d.ts',
        import: './index.js',
        require: './index.js',
        default: './index.js',
    },
};

async function updateDistPackageJson(distRoot: string) {
    const packageJsonPath = path.resolve(distRoot, './package.json');
    const packageJson = await toolkit.fs.readJson(packageJsonPath);

    packageJson.types = 'index.d.ts';
    packageJson.exports = PACKAGE_EXPORTS;

    await writeJsonFile(packageJsonPath, packageJson, {
        detectIndent: true,
        indent: 2,
    });
}

async function copyLibPackageToDist(libName: (typeof LIB_PACKAGES)[number]) {
    const packageRoot = path.resolve(process.cwd(), `./packages/${libName}`);
    const distRoot = path.resolve(process.cwd(), `./dist/${libName}`);
    const libPath = path.resolve(packageRoot, './lib');

    if (!(await toolkit.fs.pathExists(libPath))) {
        throw new Error(`${libPath} has not exists, please run build for @docgeni/${libName} first`);
    }

    await toolkit.fs.remove(distRoot);
    await toolkit.fs.ensureDir(distRoot);
    await toolkit.fs.copy(libPath, distRoot);

    for (const fileName of COPY_FILES) {
        const srcPath = path.resolve(packageRoot, `./${fileName}`);
        if (await toolkit.fs.pathExists(srcPath)) {
            await toolkit.fs.copy(srcPath, path.resolve(distRoot, `./${fileName}`));
        }
    }

    await updateDistPackageJson(distRoot);

    toolkit.print.success(`copy @docgeni/${libName} to dist/${libName} success`);
}

async function updateTemplatePackageJson() {
    const templatePackageJsonPath = path.resolve(process.cwd(), './dist/template/package.json');
    const packageJson = await toolkit.fs.readJson(templatePackageJsonPath);
    Object.assign(packageJson, {
        private: false,
    });
    await writeJsonFile(templatePackageJsonPath, packageJson, {
        detectIndent: true,
        indent: 2,
    });
    toolkit.print.success(`update dist/template/package.json 's private to false success`);
}

async function main() {
    for (const libName of LIB_PACKAGES) {
        await copyLibPackageToDist(libName);
    }
    await updateTemplatePackageJson();
}

main();
