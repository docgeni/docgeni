import { getSystemPath, normalize, Path, virtualFs } from '@angular-devkit/core';
import { NodeJsAsyncHost } from '@angular-devkit/core/node';
import { FSWatcher, WatchOptions } from 'chokidar';
import { constants, PathLike, promises as fsPromises } from 'fs';
import { Observable, from } from 'rxjs';
import { publish, refCount, tap } from 'rxjs/operators';
import { FileSystemWatcher, HostWatchEvent } from './watcher';

async function exists(path: PathLike): Promise<boolean> {
    try {
        await fsPromises.access(path, constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

export type DocgeniHostWatchOptions = WatchOptions & {
    recursive?: boolean;
};

export class DocgeniNodeJsAsyncHost extends NodeJsAsyncHost {
    exists(path: Path): Observable<boolean> {
        return from(exists(getSystemPath(path)));
    }

    watch(path: string, options?: DocgeniHostWatchOptions): Observable<virtualFs.HostWatchEvent> {
        options = { persistent: true, recursive: true, ...options };
        const watcher = new FileSystemWatcher(options);
        return watcher.watch(path) as Observable<virtualFs.HostWatchEvent>;
    }
}
