import { toolkit } from '@docgeni/toolkit';
import * as path from 'path';
import { writeJsonFile } from 'write-json-file';

const LIB_PACKAGES = ['cli', 'core', 'ngdoc', 'toolkit'] as const;
const COPY_FILES = ['package.json', 'README.md', 'CHANGELOG.md'] as const;
const WORKSPACE_PACKAGE_PATHS = ['packages/toolkit', 'packages/ngdoc', 'packages/core', 'packages/cli', 'packages/template'] as const;
const DEPENDENCY_FIELDS = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'] as const;

const PACKAGE_EXPORTS = {
    '.': {
        types: './index.d.ts',
        import: './index.js',
        require: './index.js',
        default: './index.js',
    },
};

async function loadWorkspacePackageVersions(): Promise<Record<string, string>> {
    const versions: Record<string, string> = {};
    for (const packagePath of WORKSPACE_PACKAGE_PATHS) {
        const packageJsonPath = path.resolve(process.cwd(), packagePath, 'package.json');
        const packageJson = await toolkit.fs.readJson(packageJsonPath);
        versions[packageJson['name']] = packageJson['version'];
    }
    return versions;
}

function syncWorkspaceDependencies(packageJson: Record<string, any>, workspaceVersions: Record<string, string>) {
    for (const field of DEPENDENCY_FIELDS) {
        const deps = packageJson[field];
        if (!deps || typeof deps !== 'object') {
            continue;
        }
        for (const [name, currentVersion] of Object.entries(deps)) {
            const latestVersion = workspaceVersions[name];
            if (!latestVersion) {
                continue;
            }
            const toVersion = `^${latestVersion}`;
            if (currentVersion !== toVersion) {
                toolkit.print.info(`sync ${packageJson['name']} ${field}.${name}: ${currentVersion} -> ${toVersion}`);
                deps[name] = toVersion;
            }
        }
    }
}

async function updateDistPackageJson(distRoot: string, workspaceVersions: Record<string, string>) {
    const packageJsonPath = path.resolve(distRoot, './package.json');
    const packageJson = await toolkit.fs.readJson(packageJsonPath);

    packageJson.types = 'index.d.ts';
    packageJson.exports = PACKAGE_EXPORTS;
    syncWorkspaceDependencies(packageJson, workspaceVersions);

    await writeJsonFile(packageJsonPath, packageJson, {
        detectIndent: true,
        indent: 2,
    });
}

async function copyLibPackageToDist(libName: (typeof LIB_PACKAGES)[number], workspaceVersions: Record<string, string>) {
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

    if (libName === 'cli') {
        const binPath = path.resolve(packageRoot, './bin');
        if (!(await toolkit.fs.pathExists(binPath))) {
            throw new Error(`${binPath} has not exists, please check @docgeni/cli bin folder`);
        }
        await toolkit.fs.copy(binPath, path.resolve(distRoot, './bin'));
    }

    await updateDistPackageJson(distRoot, workspaceVersions);

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
    const workspaceVersions = await loadWorkspacePackageVersions();
    for (const libName of LIB_PACKAGES) {
        await copyLibPackageToDist(libName, workspaceVersions);
    }
    await updateTemplatePackageJson();
}

main();
