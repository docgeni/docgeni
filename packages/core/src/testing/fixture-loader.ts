import * as path from 'path';
import { toolkit } from '@docgeni/toolkit';
import { relative, resolve } from '../fs';
import { compatibleNormalize } from '../markdown';

export const FIXTURES_PATH = path.resolve(__dirname, '../../test/fixtures');
export const basicFixturePath = path.resolve(__dirname, '../../test/fixtures/basic');

export class FixtureResult {
    constructor(public rootPath: string, public src: Record<string, string>, public output: Record<string, string>) {}

    getSrcPath(relativePath: string) {
        return resolve(this.rootPath, relativePath ? `src/${relativePath}` : 'src');
    }

    getOutputContent(relativePath: string, needNormalize = false) {
        const output = this.output[relativePath];
        return needNormalize ? compatibleNormalize(output).trim() : output;
    }
}

async function internalLoadFixture(name: string, rootName: 'src' | 'output'): Promise<Record<string, string>> {
    const allDirAndFiles = toolkit.fs.globSync(path.resolve(FIXTURES_PATH, `./${name}/${rootName}/**`));
    const files: Record<string, string> = {};
    for (const dirOrFile of allDirAndFiles) {
        if (!toolkit.fs.isDirectory(dirOrFile)) {
            const basePath = resolve(FIXTURES_PATH, `./${name}/${rootName}`);
            const relativePath = relative(basePath, dirOrFile);
            files[relativePath] = await toolkit.fs.readFileContent(dirOrFile);
        }
    }
    return files;
}

export async function loadFixture(name: string): Promise<FixtureResult> {
    const src = await internalLoadFixture(name, 'src');
    const output = await internalLoadFixture(name, 'output');
    const rootPath = path.resolve(FIXTURES_PATH, `./${name}`);
    return new FixtureResult(rootPath, src, output);
}
