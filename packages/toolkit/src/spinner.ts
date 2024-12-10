import ora from 'ora';
import { colors } from './colors';
import { isTTY } from './is-tty';

export class Spinner {
    private readonly spinner: ora.Ora;
    public enabled = true;
    protected startTime: Date;

    constructor(text?: string) {
        this.spinner = ora({
            text: text,
            // The below 2 options are needed because otherwise CTRL+C will be delayed
            // when the underlying process is sync.
            hideCursor: false,
            discardStdin: false,
            isEnabled: isTTY(),
        });
    }

    get text() {
        return this.spinner.text;
    }
    set text(text: string) {
        this.spinner.text = text;
    }

    get isSpinning(): boolean {
        return this.spinner.isSpinning;
    }

    succeed(text?: string): void {
        if (this.enabled) {
            this.spinner.succeed(text);
        }
    }

    info(text?: string): void {
        if (this.enabled) {
            this.spinner.info(text);
        }
    }

    warn(text?: string): void {
        if (this.enabled) {
            this.spinner.warn(text);
        }
    }

    fail(text?: string): void {
        this.spinner.fail(text && colors.redBright(text));
    }

    stop(): void {
        this.spinner.stop();
    }

    start(text?: string): void {
        if (this.enabled) {
            this.startTime = new Date();
            this.spinner.start(text);
        }
    }
}
