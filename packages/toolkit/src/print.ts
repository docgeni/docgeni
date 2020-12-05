import chalk from 'chalk';
import { colors, Colors } from './colors';
import { timestamp, isFunction } from './utils';
import { format } from 'util';

export interface PrintOptions {
    timePrefix?: boolean;
    prefix?: string | (() => string);
    silent?: boolean;
}

export enum Levels {
    fancy,
    info,
    debug,
    warn,
    error,
    succuss
}

export class Print {
    constructor(private options: PrintOptions = {}) {}

    get chalk(): chalk.Chalk {
        return chalk;
    }

    get colors(): Colors {
        return colors;
    }

    /**
     * Prints text without theme.
     *
     * Use this when you're writing stuff outside the toolkit of our
     * printing scheme.  hint: rarely.
     *
     * @param message The message to write.
     */
    fancy(message: string, ...optionalParams: any[]) {
        const msg = this.format(Levels.fancy, message, ...optionalParams);
        if (!this.options.silent) {
            console.log(msg);
        }
    }

    debug(message: string) {
        const msg = this.format(Levels.debug, message);
        if (!this.options.silent) {
            console.log(msg);
        }
    }

    info(message: string, ...optionalParams: any[]) {
        const msg = this.format(Levels.info, message, ...optionalParams);
        if (!this.options.silent) {
            console.log(msg);
        }
    }

    warn(message: string, ...optionalParams: any[]) {
        const msg = this.format(Levels.warn, message, ...optionalParams);
        if (!this.options.silent) {
            console.log(msg);
        }
    }

    error(message: string, ...optionalParams: any[]) {
        const msg = this.format(Levels.error, message, ...optionalParams);
        if (!this.options.silent) {
            console.log(msg);
        }
    }

    succuss(message: string, ...optionalParams: any[]) {
        const msg = this.format(Levels.succuss, message, ...optionalParams);
        if (!this.options.silent) {
            console.log(msg);
        }
    }

    format(level: Levels, message: string, ...optionalParams: any[]) {
        let msg = format(message, ...optionalParams);
        switch (level) {
            case Levels.info:
                msg = chalk.blue(msg);
                break;

            case Levels.debug:
                msg = chalk.cyan(msg);
                break;

            case Levels.warn:
                msg = chalk.yellow(msg);
                break;

            case Levels.error:
                msg = chalk.red(msg);
                break;
            case Levels.succuss:
                msg = chalk.green(msg);
                break;
        }
        let prefix: string;
        if (this.options.prefix) {
            prefix = isFunction(this.options.prefix) ? this.options.prefix() : this.options.prefix;
        } else if (this.options.timePrefix) {
            prefix = timestamp('HH:mm:ss');
        }
        if (prefix) {
            msg = `[${chalk.gray(prefix)}] ${msg}`;
        }
        return msg;
    }
}
