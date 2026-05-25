import { toolkit } from '@docgeni/toolkit';
import * as path from 'path';
import yargs from 'yargs-parser';

const PUBLISH_PACKAGES = [
    { name: 'toolkit', root: './dist/toolkit' },
    { name: 'ngdoc', root: './dist/ngdoc' },
    { name: 'core', root: './dist/core' },
    { name: 'template', root: './dist/template' },
    { name: 'cli', root: './dist/cli' },
    { name: 'create-docgeni', root: './packages/create-docgeni' },
] as const;

const VALID_TAGS = ['latest', 'next'] as const;

type PublishTag = (typeof VALID_TAGS)[number];

function resolvePublishTag(args: yargs.Arguments): PublishTag {
    const tag = (args['tag'] || args['dist-tag'] || 'latest') as string;
    if (!VALID_TAGS.includes(tag as PublishTag)) {
        throw new Error(`Invalid tag "${tag}", only "latest" and "next" are supported`);
    }
    return tag as PublishTag;
}

async function publishPackage(packageRoot: string, tag: PublishTag) {
    const distRoot = path.resolve(process.cwd(), packageRoot);
    const packageJsonPath = path.resolve(distRoot, './package.json');

    if (!(await toolkit.fs.pathExists(packageJsonPath))) {
        throw new Error(`${packageJsonPath} has not exists, please run pnpm build first`);
    }

    const packageJson = await toolkit.fs.readJson(packageJsonPath);
    const publishArgs = ['publish', '--access=public'];
    if (tag === 'next') {
        publishArgs.push('--tag=next');
    }

    toolkit.print.info(`Publishing ${packageJson.name}@${packageJson.version} with tag ${tag}...`);
    const result = toolkit.shell.spawnSync('npm', publishArgs, { cwd: distRoot, stdio: 'inherit' });
    if (result.status !== 0) {
        throw new Error(`Failed to publish ${packageJson.name}@${packageJson.version}`);
    }
    toolkit.print.success(`Publish ${packageJson.name}@${packageJson.version} success`);
}

async function main() {
    const tag = resolvePublishTag(yargs(process.argv));

    for (const pkg of PUBLISH_PACKAGES) {
        await publishPackage(pkg.root, tag);
    }
}

main().catch((error: Error) => {
    toolkit.print.error(error);
    process.exit(1);
});
