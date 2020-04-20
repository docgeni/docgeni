import { Template } from './template';
import * as fs from './filesystem';
import * as path from 'path';
import * as strings from './strings';
import * as utils from './utils';
import { Print } from './print';

export interface ToolkitConfig {
    baseDir: string;
}

export class Toolkit {
    private static _config: ToolkitConfig;
    private static _template: Template;
    private static _print: Print;

    static get config() {
        if (!this._config) {
            throw new Error(`CliKits has not initialize, please call CliKits.initialize`);
        }
        return this._config;
    }

    static initialize(config: ToolkitConfig) {
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

    static get strings() {
        return strings;
    }

    static get utils() {
        return utils;
    }

    static get print() {
        if (!this._print) {
            this._print = new Print({
                timePrefix: true
            });
        }
        return this._print;
    }
}
