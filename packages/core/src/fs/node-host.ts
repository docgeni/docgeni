import { getSystemPath, normalize, Path, virtualFs } from '@angular-devkit/core';
import { NodeJsAsyncHost } from '@angular-devkit/core/node';
import { toolkit } from '@docgeni/toolkit';
import { FSWatcher, WatchOptions } from 'chokidar';
import { constants, PathLike, promises as fsPromises } from 'fs';
import { Observable, from } from 'rxjs';
import { publish, refCount } from 'rxjs/operators';

async function exists(path: PathLike): Promise<boolean> {
    try {
        await fsPromises.access(path, constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

export enum HostWatchEventType {
    Changed = 0,
    Created = 1,
    Deleted = 2,
    Renamed = 3
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
        return new Observable<virtualFs.HostWatchEvent>(obs => {
            const watcher = new FSWatcher(options);
            watcher.add(getSystemPath(normalize(path)));
            watcher
                .on('change', path => {
                    obs.next({
                        path: normalize(path),
                        time: new Date(),
                        type: (HostWatchEventType.Changed as unknown) as virtualFs.HostWatchEventType
                    });
                })
                .on('add', path => {
                    obs.next({
                        path: normalize(path),
                        time: new Date(),
                        type: (HostWatchEventType.Created as unknown) as virtualFs.HostWatchEventType
                    });
                })
                .on('unlink', path => {
                    obs.next({
                        path: normalize(path),
                        time: new Date(),
                        type: (HostWatchEventType.Deleted as unknown) as virtualFs.HostWatchEventType
                    });
                });

            return () => watcher.close();
        }).pipe(publish(), refCount());
    }
}
