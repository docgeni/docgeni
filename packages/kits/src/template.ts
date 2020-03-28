import * as handlebars from 'handlebars';
import { readFileSync, writeFileSync, throwErrorWhenNotExists } from './filesystem';
import * as path from 'path';

export interface TemplateOptions {
    baseDir: string;
}

export class Template {
    constructor(protected options: TemplateOptions) {}

    private getAbsPath(templatePath: string) {
        return path.resolve(this.options.baseDir, templatePath);
    }

    public compile<T>(templatePath: string, data?: T) {
        const absPath = this.getAbsPath(templatePath);
        throwErrorWhenNotExists(absPath);
        const content = readFileSync(absPath, 'UTF-8');
        const template = handlebars.compile(content);
        return template(data);
    }

    public generate<T>(templatePath: string, destPath: string, data?: T) {
        const content = this.compile(templatePath, data);
        writeFileSync(destPath, content, {});
    }
}
