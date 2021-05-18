import { toolkit, fs } from '@docgeni/toolkit';
import * as path from 'path';
import { DocMeta } from '../types';
import { DocType } from '../enums';
import { Markdown } from '../markdown';

export interface DocSourceFileOptions {
    event: 'add' | 'change' | 'unlink';
    cwd: string;
    base: string;
    path: string;
    locale: string;
    type?: DocType;
}

export class DocSourceFile {
    private emitted = false;
    public locale: string;
    public cwd: string;
    public base: string;
    public path: string;
    public type: DocType;
    public content: string;
    public meta?: DocMeta;
    public output: string;
    public outputPath?: string;
    public event: DocSourceFileOptions['event'];
    /**
     * @example "docs/guide/getting-started.md" when base is cwd and path=/../docs/guide/getting-started.md
     */
    public get relative() {
        return path.relative(this.base, this.path);
    }
    /**
     * @example "docs/guide" when base is cwd and path is /../docs/guide/getting-started.md
     */
    public get relativeDirname() {
        const relative = this.relative;
        return relative.replace(`/${this.basename}`, '');
    }
    /**
     * @example "/../docs/guide" when path=/../docs/guide/getting-started.md
     */
    public get dirname() {
        return path.dirname(this.path);
    }
    /**
     * @example "getting-started.md" when path=/../docs/guide/getting-started.md
     */
    public get basename() {
        return path.basename(this.path);
    }
    /**
     * @example ".md" when path=/../docs/guide/getting-started.md
     */
    public get extname() {
        return path.extname(this.path);
    }
    /**
     * @example "getting-started" when path=/../docs/guide/getting-started.md
     */
    public get name() {
        if (!this.path) {
            throw new Error('No path specified! Can not get stem.');
        }
        return path.basename(this.path, this.extname);
    }

    constructor(options: DocSourceFileOptions) {
        this.cwd = options.cwd;
        this.base = options.base;
        this.path = options.path;
        this.locale = options.locale;
        this.type = options.type || DocType.general;
        this.event = options.event;
    }

    private async read(): Promise<string> {
        this.content = await toolkit.fs.readFileContent(this.path, 'utf-8');
        return this.content;
    }

    public async build() {
        if (this.event === 'unlink') {
            return;
        }
        this.emitted = false;
        const content = await this.read();
        const result = Markdown.parse<DocMeta>(content);
        this.meta = result.attributes;
        this.output = Markdown.toHTML(result.body);
    }

    public async emit(destRootPath: string) {
        const outputPath = this.getOutputPath(destRootPath);
        if (this.event === 'unlink') {
            toolkit.fs.removeSync(outputPath);
            this.emitted = true;
            return;
        }
        if (this.emitted) {
            return;
        }
        await toolkit.fs.ensureWriteFile(outputPath, this.output);
        this.emitted = true;
    }

    public getOutputDir(outputRootPath: string) {
        return path.resolve(outputRootPath, this.relativeDirname);
    }

    public getOutputPath(outputRootPath: string, ext = '.html') {
        return path.resolve(this.getOutputDir(outputRootPath), this.name + ext);
    }

    public getRelativeOutputPath(ext = '.html') {
        return `${this.relativeDirname}/${this.name}${ext}`;
    }

    public isEmpty() {
        return toolkit.utils.isEmpty(this.content);
    }
}
