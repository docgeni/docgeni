import { EmitFile, EmitFiles } from '../types';

export abstract class FileEmitter<T = unknown> {
    protected emitted: boolean;
    protected emitFiles: EmitFiles;
    abstract onEmit(objects?: T[]): Promise<void>;

    async emit(objects?: T[]): Promise<EmitFiles> {
        if (this.emitted) {
            return {};
        }
        this.emitFiles = {};
        await this.onEmit(objects);
        this.emitted = true;
        return this.emitFiles;
    }

    protected async addEmitFiles(adds: EmitFiles) {
        Object.assign(this.emitFiles, adds);
    }

    protected async addEmitFile(path: string, file: EmitFile | string) {
        this.emitFiles[path] = file;
    }

    protected async resetEmitted() {
        this.emitted = false;
    }
}
