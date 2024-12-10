import { Observable, Subject } from 'rxjs';
import { FSWatcher, WatchOptions } from 'chokidar';
import { getSystemPath, Path, virtualFs } from '@angular-devkit/core';
import { normalize } from '../path';
import { coerceArray } from '../utils';

export enum HostWatchEventType {
    Changed = 0,
    Created = 1,
    Deleted = 2,
    Renamed = 3,
}

export interface HostWatchEvent {
    readonly time: Date;
    readonly type: HostWatchEventType | virtualFs.HostWatchEventType;
    readonly path: Path;
}

export class FileSystemWatcher {
    private watcher: FSWatcher;
    private events$ = new Subject<HostWatchEvent>();

    constructor(options: WatchOptions = { persistent: true, ignoreInitial: true }) {
        this.watcher = new FSWatcher(options);
        this.initialize();
    }

    private emitEvent(path: string, type: HostWatchEventType) {
        this.events$.next({
            path: normalize(path),
            time: new Date(),
            type: type,
        });
    }

    private initialize() {
        this.watcher
            .on('change', (path) => {
                this.emitEvent(path, HostWatchEventType.Changed);
            })
            .on('add', (path) => {
                this.emitEvent(path, HostWatchEventType.Created);
            })
            .on('unlink', (path) => {
                this.emitEvent(path, HostWatchEventType.Deleted);
            });
    }

    watch(paths: string | string[]): Observable<HostWatchEvent> {
        // this.watcher.add(paths);
        this.watcher.add(coerceArray(paths).map((path) => getSystemPath(normalize(path))));
        return this.events$.asObservable();
    }

    aggregated(aggregateInterval: number = 500): Observable<HostWatchEvent[]> {
        return new Observable((subscribe) => {
            let aggregatedEvents: HostWatchEvent[] = [];
            let aggregateTimeout: NodeJS.Timeout;
            const subscription = this.events$.subscribe((event) => {
                if (aggregateTimeout) {
                    // eslint-disable-next-line no-restricted-globals
                    clearTimeout(aggregateTimeout);
                }
                aggregatedEvents.push(event);

                // eslint-disable-next-line no-restricted-globals
                aggregateTimeout = setTimeout(() => {
                    subscribe.next(aggregatedEvents);
                    aggregatedEvents = [];
                    aggregateTimeout = null;
                }, aggregateInterval);
            });
            return () => subscription.unsubscribe();
        });
    }

    async close() {
        this.events$.complete();
        this.watcher.removeAllListeners();
        await this.watcher.close();
    }
}
