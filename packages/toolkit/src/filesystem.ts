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

export * from 'fs-extra';
