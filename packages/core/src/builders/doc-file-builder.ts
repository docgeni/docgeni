import { toolkit, fs } from '@docgeni/toolkit';
import * as path from 'path';
import { DocMeta } from '../docgeni.interface';
import { Markdown } from '../markdown';

export interface DocFileBuilderOptions {
    cwd: string;
    base: string;
    path: string;
    locale: string;
}

export class DocFileBuilder {
    private emitted = false;
    public locale: string;
    public cwd: string;
    public base: string;
    public path: string;
    public raw: Buffer | string | NodeJS.ReadableStream;
    public content: string;
    public meta?: DocMeta;
    public output: string;
    public outputPath?: string;
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

    constructor(options: DocFileBuilderOptions) {
        this.cwd = options.cwd;
        this.base = options.base;
        this.path = options.path;
        this.locale = options.locale;
        this.raw = fs.createReadStream(this.path);
    }

    private read(): Promise<string> {
        return new Promise((resolve, reject) => {
            if (toolkit.fs.isStream(this.raw)) {
                const chunks = [];
                this.raw.on('data', chunk => chunks.push(chunk));
                this.raw.on('error', reject);
                this.raw.on('end', () => {
                    this.raw = Buffer.concat(chunks).toString('utf8');
                    resolve(this.raw);
                });
            } else if (Buffer.isBuffer(this.raw)) {
                this.raw = this.raw.toString('utf8');
                return resolve(this.raw);
            } else {
                return resolve(this.raw);
            }
        });
    }

    public async build() {
        this.emitted = false;
        const content = await this.read();
        const result = Markdown.parse<DocMeta>(content);
        this.meta = result.attributes;
        this.output = Markdown.toHTML(result.body);
    }

    public async emit(destRootPath: string) {
        if (this.emitted) {
            return;
        }
        const outputPath = this.getOutputPath(destRootPath);
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
