import * as fsExtra from 'fs-extra';
import * as nodePath from 'path';

export function throwErrorWhenNotExists(absPath: string) {
    if (!fsExtra.existsSync(absPath)) {
        throw new Error(`${absPath} has not exists`);
    }
}

export function isDirectory(dir: string) {
    return fsExtra.statSync(dir).isDirectory();
}

export async function getDirs(path: string) {
    const dirs = await fsExtra.readdir(path);
    return dirs.filter(dir => {
        return isDirectory(nodePath.resolve(path, dir));
    });
}

export async function pathsExists(paths: string[]) {
    const result = [];
    let hasExists = false;
    let existsCount = 0;
    for (const path of paths) {
        const pathExists = await fsExtra.pathExists(path);
        if (pathExists) {
            hasExists = true;
            existsCount++;
        }
        result.push(pathExists);
    }
    return {
        result,
        allExists: existsCount === result.length,
        hasExists
    };
}

export async function ensureWriteFile(filePath: string, data: string, options?: fsExtra.WriteFileOptions | string) {
    await fsExtra.ensureFile(filePath);
    await fsExtra.writeFile(filePath, data);
}

export * from 'fs-extra';
