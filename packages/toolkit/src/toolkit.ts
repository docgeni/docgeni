import { Template } from './template';
import * as fs from './filesystem';
import * as nodePath from 'path';
import * as path from './path';
import * as strings from './strings';
import * as utils from './utils';
import * as shell from './shell';
import * as git from './git';
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
            throw new Error(`Toolkit has not initialize, please call Toolkit.initialize`);
        }
        return this._config;
    }

    static initialize(config: ToolkitConfig) {
        this._config = config;
        // clear cache
        this._template = null;
    }

    static get template() {
        if (!this._template) {
            this._template = new Template({
                baseDir: nodePath.resolve(this.config.baseDir, 'templates')
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

    static get shell() {
        return shell;
    }

    static get print() {
        if (!this._print) {
            this._print = new Print({
                timePrefix: false
            });
        }
        return this._print;
    }

    static get git() {
        return git;
    }

    static get path() {
        return path;
    }
}
