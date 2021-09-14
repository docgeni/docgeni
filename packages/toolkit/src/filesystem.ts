import fsExtra from 'fs-extra';
import nodePath from 'path';
import { WriteStream, ReadStream } from 'fs';
import { matchGlob } from './utils';
import glob from 'glob';

export function throwErrorWhenNotExists(absPath: string) {
    if (!fsExtra.existsSync(absPath)) {
        throw new Error(`${absPath} has not exists`);
    }
}

export function isDirectory(dir: string) {
    return fsExtra.statSync(dir).isDirectory();
}

export interface GetDirsOrFilesOptions {
    /** Include .dot files in normal matches */
    dot?: boolean;
    /** Exclude files in normal matches */
    exclude?: string | string[];
}

const DEFAULT_OPTIONS: GetDirsOrFilesOptions = {
    dot: false
};
export async function getDirsAndFiles(path: string, options?: GetDirsOrFilesOptions) {
    options = {
        ...DEFAULT_OPTIONS,
        ...options
    };
    const dirs = await fsExtra.readdir(path);
    return dirs.filter(dir => {
        if (options.exclude && matchGlob(dir, options.exclude)) {
            return false;
        }
        if (options.dot) {
            return true;
        } else {
            return !dir.startsWith('.');
        }
    });
}

export async function getDirs(path: string, options?: GetDirsOrFilesOptions) {
    const dirs = await getDirsAndFiles(path, options);
    return dirs.filter(dir => {
        return isDirectory(nodePath.resolve(path, dir));
    });
}

export function globSync(pattern: string, options?: GetDirsOrFilesOptions & { root?: string }) {
    options = {
        ...DEFAULT_OPTIONS,
        ...options
    };
    const result = glob.sync(pattern, {
        dot: options.dot,
        root: options.root
    });
    return result.filter(dir => {
        if (options.exclude && matchGlob(dir, options.exclude)) {
            return false;
        }
        return true;
    });
}

// export async function pathsExists(paths: string[]) {
//     const result = [];
//     let hasExists = false;
//     let existsCount = 0;
//     for (const path of paths) {
//         const pathExists = await fsExtra.pathExists(path);
//         if (pathExists) {
//             hasExists = true;
//             existsCount++;
//         }
//         result.push(pathExists);
//     }
//     return {
//         result,
//         allExists: existsCount === result.length,
//         hasExists
//     };
// }

export async function readFileContent(filePath: string, encoding: string = 'UTF-8'): Promise<string> {
    const result = await fsExtra.readFile(filePath, encoding);
    return result;
}

// export function isStream(stream: any): stream is NodeJS.ReadableStream {
//     if (!stream) {
//         return false;
//     }

//     if (typeof stream.pipe !== 'function') {
//         return false;
//     }

//     return true;
// }

export * from 'fs-extra';
