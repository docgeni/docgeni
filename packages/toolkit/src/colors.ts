import chalk from 'chalk';
export class Colors {
    red(...text: unknown[]): string {
        return chalk.red(...text);
    }

    green(...text: unknown[]): string {
        return chalk.green(...text);
    }

    gray(...text: unknown[]): string {
        return chalk.gray(...text);
    }

    grey(...text: unknown[]): string {
        return chalk.grey(...text);
    }

    black(...text: unknown[]): string {
        return chalk.black(...text);
    }

    yellow(...text: unknown[]): string {
        return chalk.yellow(...text);
    }

    blue(...text: unknown[]): string {
        return chalk.blue(...text);
    }

    magenta(...text: unknown[]): string {
        return chalk.magenta(...text);
    }

    cyan(...text: unknown[]): string {
        return chalk.cyan(...text);
    }

    white(...text: unknown[]): string {
        return chalk.white(...text);
    }

    blackBright(...text: unknown[]) {
        return chalk.blackBright(...text);
    }

    redBright(...text: unknown[]) {
        return chalk.redBright(...text);
    }

    greenBright(...text: unknown[]) {
        return chalk.greenBright(...text);
    }

    yellowBright(...text: unknown[]) {
        return chalk.yellowBright(...text);
    }

    blueBright(...text: unknown[]) {
        return chalk.blueBright(...text);
    }

    magentaBright(...text: unknown[]) {
        return chalk.magentaBright(...text);
    }

    cyanBright(...text: unknown[]) {
        return chalk.cyanBright(...text);
    }

    whiteBright(...text: unknown[]) {
        return chalk.whiteBright(...text);
    }

    bgBlack(...text: unknown[]) {
        return chalk.bgBlack(...text);
    }

    bgRed(...text: unknown[]) {
        return chalk.bgRed(...text);
    }

    bgGreen(...text: unknown[]) {
        return chalk.bgGreen(...text);
    }

    bgYellow(...text: unknown[]) {
        return chalk.bgYellow(...text);
    }

    bgBlue(...text: unknown[]) {
        return chalk.bgBlue(...text);
    }

    bgMagenta(...text: unknown[]) {
        return chalk.bgMagenta(...text);
    }

    bgCyan(...text: unknown[]) {
        return chalk.bgCyan(...text);
    }

    bgWhite(...text: unknown[]) {
        return chalk.bgWhite(...text);
    }

    bgGray(...text: unknown[]) {
        return chalk.bgGray(...text);
    }

    bgGrey(...text: unknown[]) {
        return chalk.bgGrey(...text);
    }

    bgBlackBright(...text: unknown[]) {
        return chalk.bgBlackBright(...text);
    }

    bgRedBright(...text: unknown[]) {
        return chalk.bgRedBright(...text);
    }

    bgGreenBright(...text: unknown[]) {
        return chalk.bgGreenBright(...text);
    }

    bgYellowBright(...text: unknown[]) {
        return chalk.bgYellowBright(...text);
    }

    bgBlueBright(...text: unknown[]) {
        return chalk.bgBlueBright(...text);
    }

    bgMagentaBright(...text: unknown[]) {
        return chalk.bgMagentaBright(...text);
    }

    bgCyanBright(...text: unknown[]) {
        return chalk.bgCyanBright(...text);
    }

    bgWhiteBright(...text: unknown[]) {
        return chalk.bgWhiteBright(...text);
    }

    bold(...text: unknown[]) {
        return chalk.bold(...text);
    }
}

const colors = new Colors();

export { colors };
