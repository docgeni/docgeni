import { PathFragment, virtualFs } from '@angular-devkit/core';
import { Observable } from 'rxjs';
import { DocgeniHostWatchOptions, resolve, normalize, VfsHost, FileSystemWatcher, HostWatchEvent, relative } from './fs';
import { toolkit } from '@docgeni/toolkit';

export interface GetDirsOrFilesOptions {
    /** Include .dot files in normal matches */
    dot?: boolean;
    /** Exclude files in normal matches */
    exclude?: string | string[];
}
export interface DocgeniHost {
    readFile(path: string): Promise<string>;
    readJSON<T = object>(path: string): Promise<T>;
    writeFile(path: string, data: string): Promise<void>;
    pathExists(path: string): Promise<boolean>;
    exists(path: string): Promise<boolean>;
    isDirectory(path: string): Promise<boolean>;
    isFile(path: string): Promise<boolean>;
    watch(path: string, options?: DocgeniHostWatchOptions): Observable<HostWatchEvent>;
    watchAggregated(path: string | string[], options?: DocgeniHostWatchOptions): Observable<HostWatchEvent[]>;
    copy(src: string, dest: string): Promise<void>;
    delete(path: string): Promise<void>;
    list(path: string): Promise<PathFragment[]>;
    getDirsAndFiles(path: string, options?: GetDirsOrFilesOptions): Promise<PathFragment[]>;
    getDirs(path: string, options?: GetDirsOrFilesOptions): Promise<PathFragment[]>;
    getFiles(path: string, options?: GetDirsOrFilesOptions): Promise<PathFragment[]>;
    getAllFiles(path: string, options?: GetDirsOrFilesOptions): Promise<string[]>;
}

export class DocgeniHostImpl implements DocgeniHost {
    constructor(public readonly host: virtualFs.Host) {}

    async readFile(path: string): Promise<string> {
        const data = await this.host.read(normalize(path)).toPromise();
        return virtualFs.fileBufferToString(data);
    }

    async readJSON<T = object>(path: string): Promise<T> {
        const content = await this.readFile(path);
        return JSON.parse(content);
    }

    async writeFile(path: string, data: string): Promise<void> {
        return this.host.write(normalize(path), virtualFs.stringToFileBuffer(data)).toPromise();
    }

    async pathExists(path: string): Promise<boolean> {
        return this.exists(path);
    }

    async exists(path: string): Promise<boolean> {
        return this.host.exists(normalize(path)).toPromise();
    }

    async isDirectory(path: string): Promise<boolean> {
        return this.host.isDirectory(normalize(path)).toPromise();
    }

    async isFile(path: string): Promise<boolean> {
        return this.host.isFile(normalize(path)).toPromise();
    }

    watch(path: string, options?: DocgeniHostWatchOptions): Observable<HostWatchEvent> {
        options = { persistent: true, ...options };
        return this.host.watch(normalize(path), options) as Observable<HostWatchEvent>;
    }

    watchAggregated(path: string | string[], options?: DocgeniHostWatchOptions): Observable<HostWatchEvent[]> {
        const watcher = new FileSystemWatcher(options);
        watcher.watch(path);
        return watcher.aggregated();
    }

    async stat(path: string) {
        return this.host.stat(normalize(path)).toPromise();
    }

    async copy(src: string, dest: string): Promise<void> {
        const stat = await this.stat(src);
        if (!stat) {
            throw new Error(`${src} is not exist`);
        }
        if (stat.isFile()) {
            const data = await this.host.read(normalize(src)).toPromise();
            await this.host.write(normalize(dest), data).toPromise();
        } else {
            const result = await this.list(src);
            for (const item of result) {
                await this.copy(resolve(normalize(src), item), resolve(normalize(dest), item));
            }
        }
    }

    async delete(path: string): Promise<void> {
        return this.host.delete(normalize(path)).toPromise();
    }

    async list(path: string): Promise<PathFragment[]> {
        return this.host.list(normalize(path)).toPromise();
    }

    async getDirsAndFiles(path: string, options?: GetDirsOrFilesOptions) {
        options = {
            dot: false,
            ...options
        };
        const allPaths = await this.list(path);
        return allPaths.filter(dir => {
            if (options.exclude && toolkit.utils.matchGlob(dir, options.exclude)) {
                return false;
            }
            if (options.dot) {
                return true;
            } else {
                return !dir.startsWith('.');
            }
        });
    }

    async getDirs(path: string, options: GetDirsOrFilesOptions): Promise<PathFragment[]> {
        const allPaths = await this.getDirsAndFiles(path, options);
        const result: PathFragment[] = [];
        for (const item of allPaths) {
            if (await this.isDirectory(resolve(path, item))) {
                result.push(item);
            }
        }
        return result;
    }

    async getFiles(path: string, options?: GetDirsOrFilesOptions): Promise<PathFragment[]> {
        const allPaths = await this.getDirsAndFiles(path, options);
        const result: PathFragment[] = [];
        for (const item of allPaths) {
            if (await this.isFile(resolve(path, item))) {
                result.push(item);
            }
        }
        return result;
    }

    async getAllFiles(path: string, options?: GetDirsOrFilesOptions): Promise<string[]> {
        let files: string[] = [];
        let dirList = [path];
        while (dirList.length) {
            let dir = dirList.pop();
            let list = (await this.getDirsAndFiles(dir, options)).map(item => resolve(dir, item));
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                if (await this.isDirectory(item)) {
                    dirList.push(item);
                } else {
                    files.push(relative(path, item));
                }
            }
        }
        return files;
    }
}

export function createDocgeniHost(host: virtualFs.Host): DocgeniHost {
    return new DocgeniHostImpl(host);
}
