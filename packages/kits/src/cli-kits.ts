import { Template } from './template';
import * as fs from './filesystem';
import * as path from 'path';

export interface CliKitsConfig {
    baseDir: string;
}

export class CliKits {
    private static _config: CliKitsConfig;
    private static _template: Template;

    static get config() {
        if (!this._config) {
            throw new Error(`CliKits has not initialize, please call CliKits.initialize`);
        }
        return this._config;
    }

    static initialize(config: CliKitsConfig) {
        this._config = config;
    }

    static get template() {
        if (!this._template) {
            this._template = new Template({
                baseDir: path.resolve(this.config.baseDir, 'templates')
            });
        }
        return this._template;
    }

    static get fs() {
        return fs;
    }
}
