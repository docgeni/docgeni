import * as path from 'path';
import { toolkit } from '@docgeni/toolkit';

export const basicFixturePath = path.resolve(__dirname, './basic');

export interface FixtureResult {
    src?: Record<string, string>;
    output?: Record<string, string>;
}

export async function loadFixtureSrc(name: string): Promise<Record<string, string>> {
    const basePath = path.resolve(__dirname, `${name}/src`);
    const allDirAndFiles = toolkit.fs.globSync(path.resolve(basePath, `${name}/**`));
    const files: Record<string, string> = {};
    for (const dirOrFile of allDirAndFiles) {
        if (!toolkit.fs.isDirectory(dirOrFile)) {
            const relativePath = dirOrFile.replace(basePath, '');
            console.log(`dirOrFile: ${dirOrFile}, basePath: ${basePath}, relativePath: ${relativePath}`);
            files[relativePath] = await toolkit.fs.readFileContent(dirOrFile);
        }
    }
    return files;
}

export async function loadFixtureOutput(name: string): Promise<Record<string, string>> {
    const allDirAndFiles = toolkit.fs.globSync(path.resolve(__dirname, `${name}/output/**`));
    const files: Record<string, string> = {};
    for (const dirOrFile of allDirAndFiles) {
        if (!toolkit.fs.isDirectory(dirOrFile)) {
            const basePath = path.resolve(__dirname, `${name}/output`);
            const relativePath = dirOrFile.replace(basePath, '');
            files[relativePath] = await toolkit.fs.readFileContent(dirOrFile);
        }
    }
    return files;
}

export async function loadFixture(name: string): Promise<FixtureResult> {
    const src = await loadFixtureSrc(name);
    const output = await loadFixtureOutput(name);
    return { src: src, output: output };
}
