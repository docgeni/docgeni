import { Observable, Subject } from 'rxjs';
import { FSWatcher, WatchOptions } from 'chokidar';
import { getSystemPath, virtualFs } from '@angular-devkit/core';
import { normalize } from './path';
import { toolkit } from '@docgeni/toolkit';

export enum HostWatchEventType {
    Changed = 0,
    Created = 1,
    Deleted = 2,
    Renamed = 3
}

export class FileSystemWatcher {
    private watcher: FSWatcher;
    private events$ = new Subject<virtualFs.HostWatchEvent>();
    private aggregatedEvents$ = new Subject<virtualFs.HostWatchEvent[]>();
    private aggregateTimeout: NodeJS.Timeout;
    private aggregatedEvents: virtualFs.HostWatchEvent[] = [];

    constructor(options: WatchOptions = { persistent: true, ignoreInitial: true }) {
        this.watcher = new FSWatcher(options);
        this.initialize();
    }

    private emitEvent(path: string, type: HostWatchEventType) {
        this.events$.next({
            path: normalize(path),
            time: new Date(),
            type: (type as unknown) as virtualFs.HostWatchEventType
        });
    }

    private initialize() {
        this.watcher
            .on('change', path => {
                this.emitEvent(path, HostWatchEventType.Changed);
            })
            .on('add', path => {
                this.emitEvent(path, HostWatchEventType.Created);
            })
            .on('unlink', path => {
                this.emitEvent(path, HostWatchEventType.Deleted);
            });
    }

    watch(paths: string | string[]): Observable<virtualFs.HostWatchEvent> {
        // this.watcher.add(paths);
        this.watcher.add(toolkit.utils.coerceArray(paths).map(path => getSystemPath(normalize(path))));
        return this.events$.asObservable();
    }

    aggregated(aggregateInterval: number = 2000): Observable<virtualFs.HostWatchEvent[]> {
        // return new Observable(subscribe => {
        //     const aggregatedEvents: virtualFs.HostWatchEvent[] = [];
        //     let aggregateTimeout: NodeJS.Timeout;
        //     const subscription = this.events$.subscribe(event => {
        //         if (aggregateTimeout) {
        //             // eslint-disable-next-line no-restricted-globals
        //             clearTimeout(aggregateTimeout);
        //         }
        //         aggregatedEvents.push(event);

        //         // eslint-disable-next-line no-restricted-globals
        //         aggregateTimeout = setTimeout(() => {
        //             subscribe.next(aggregatedEvents);
        //         }, aggregateInterval);
        //     });
        //     return () => subscription.unsubscribe();
        // });
        this.events$.subscribe(event => {
            if (this.aggregateTimeout) {
                // eslint-disable-next-line no-restricted-globals
                clearTimeout(this.aggregateTimeout);
            }
            this.aggregatedEvents.push(event);

            // eslint-disable-next-line no-restricted-globals
            this.aggregateTimeout = setTimeout(() => {
                this.aggregatedEvents$.next(this.aggregatedEvents);
                this.aggregatedEvents = [];
                this.aggregateTimeout = null;
            }, 2000);
        });
        return this.aggregatedEvents$;
    }

    async close() {
        if (this.aggregateTimeout) {
            // eslint-disable-next-line no-restricted-globals
            clearTimeout(this.aggregateTimeout);
            this.aggregatedEvents$.next(this.aggregatedEvents);
            this.aggregatedEvents = [];
            this.aggregateTimeout = null;
        }
        this.events$.complete();
        this.aggregatedEvents$.complete();
        this.watcher.removeAllListeners();
        await this.watcher.close();
    }
}
