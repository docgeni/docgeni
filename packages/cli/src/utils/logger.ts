const chalk = require('chalk');
const log = require('fancy-log');

enum Levels {
    info,
    debug,
    warn,
    error
}

log.info('info', 'en');
log.dir({ name: 'hello' });
log.warn('warn', 'en');
log.error('error', 'en');
export class Logger {
    public logger: any;
    public silent: boolean;

    constructor() {
        this.logger = log;
        this.silent = true;
    }

    public info(...args: any[]) {
        if (!this.silent) {
            return;
        }
        this.logger(this.format(Levels.info, ...args));
    }

    public error(...args: any[]) {
        if (!this.silent) {
            return;
        }
        this.logger(this.format(Levels.error, ...args));
    }

    public warn(...args: any[]) {
        if (!this.silent) {
            return;
        }
        this.logger(this.format(Levels.warn, ...args));
    }

    public debug(...args: any[]) {
        if (!this.silent) {
            return;
        }
        this.logger(this.format(Levels.debug, ...args));
    }

    private format(level: Levels, ...args: any[]) {
        const pad = (s: string, l: number, z = '') => {
            return s + Array(Math.max(0, l - s.length + 1)).join(z);
        };

        let msg = args.join(' ');
        if (args.length > 1) {
            msg = `${pad(args.shift(), 15, ' ')}: ${args.join(' ')}`;
        }

        switch (level) {
            case Levels.info:
                msg = chalk.green(msg);
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
        }

        return [msg].join('');
    }
}

export let logger = new Logger();
