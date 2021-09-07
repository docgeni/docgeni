import * as path from 'path';
import { toolkit } from '@docgeni/toolkit';
import { relative, resolve } from '../fs';

export const fixturesPath = path.resolve(__dirname, '../../test/fixtures');
export const basicFixturePath = path.resolve(__dirname, '../../test/fixtures/basic');

export class FixtureResult {
    constructor(public src: Record<string, string>, public output: Record<string, string>) {}
}

async function internalLoadFixture(name: string, rootName: 'src' | 'output'): Promise<Record<string, string>> {
    const allDirAndFiles = toolkit.fs.globSync(path.resolve(fixturesPath, `./${name}/${rootName}/**`));
    const files: Record<string, string> = {};
    for (const dirOrFile of allDirAndFiles) {
        if (!toolkit.fs.isDirectory(dirOrFile)) {
            const basePath = resolve(fixturesPath, `./${name}/${rootName}`);
            const relativePath = relative(basePath, dirOrFile);
            console.log(`dirOrFile: ${dirOrFile}`);
            console.log(`basePath: ${basePath}`);
            console.log(`relativePath: ${relativePath}`);
            files[relativePath] = await toolkit.fs.readFileContent(dirOrFile);
        }
    }
    return files;
}

export async function loadFixture(name: string): Promise<FixtureResult> {
    const src = await internalLoadFixture(name, 'src');
    const output = await internalLoadFixture(name, 'output');
    return new FixtureResult(src, output);
}
