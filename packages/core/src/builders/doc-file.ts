import { toolkit } from '@docgeni/toolkit';
import path from 'path';
import { DocMeta } from '../types';
import { DocType } from '../enums';
import { Markdown } from '../markdown';
import { normalize, relative } from '@angular-devkit/core';
import { DocgeniHost } from '../docgeni-host';
import { DocgeniConfig } from '../interfaces';

export interface DocSourceFileOptions {
    cwd: string;
    base: string;
    path: string;
    locale: string;
    type?: DocType;
}

export class DocSourceFile<TMeta extends DocMeta = DocMeta> {
    private emitted = false;
    private host: DocgeniHost;
    private outputPath?: string;
    public locale: string;
    public cwd: string;
    public base: string;
    public path: string;
    public type: DocType;
    public content: string;
    public meta?: TMeta;
    public output: string;
    /**
     * @example "docs/guide/getting-started.md" when base is cwd and path=/../docs/guide/getting-started.md
     */
    public get relative() {
        return relative(normalize(this.base), normalize(this.path));
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
            throw new Error('No path specified! can not get name.');
        }
        return path.basename(this.path, this.extname);
    }

    constructor(options: DocSourceFileOptions, host: DocgeniHost, private docConfig: DocgeniConfig) {
        this.cwd = options.cwd;
        this.base = options.base;
        this.path = options.path;
        this.locale = options.locale;
        this.type = options.type || DocType.general;
        this.host = host;
    }

    private async read(): Promise<string> {
        this.content = await this.host.readFile(this.path);
        return this.content;
    }

    public async build() {
        this.emitted = false;
        const content = await this.read();
        const result = Markdown.parse<TMeta>(content);
        this.meta = result.attributes;
        const contributionInfo = this.getContributionInfo();
        this.meta.lastUpdatedTime = contributionInfo.lastUpdatedTime;
        this.meta.contributors = contributionInfo.contributors;
        this.output = Markdown.toHTML(result.body, {
            absFilePath: this.path
        });
    }

    public async emit(destRootPath: string) {
        if (this.emitted) {
            return;
        }
        const outputPath = this.getOutputPath(destRootPath);
        await this.host.writeFile(outputPath, this.output);
        if (this.outputPath && this.outputPath !== outputPath) {
            await this.host.delete(this.outputPath);
        }
        this.outputPath = outputPath;
        this.emitted = true;
    }

    public async clear() {
        if (this.outputPath) {
            await this.host.delete(this.outputPath);
            this.output = '';
            this.meta = null;
        }
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

    private getContributionInfo() {
        return {
            lastUpdatedTime: toolkit.git.lastUpdatedTime(this.path) * 1000,
            contributors: this.docConfig.repoUrl.startsWith('https://github.com') ? toolkit.git.contributors(this.path) : undefined
        };
    }
}
