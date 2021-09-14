import { colors } from '../src/colors';
import chalk from 'chalk';

describe('#colors', () => {
    it('should set color success', () => {
        [
            'red',
            'green',
            'gray',
            'grey',
            'black',
            'yellow',
            'blue',
            'magenta',
            'cyan',
            'white',
            'blackBright',
            'redBright',
            'greenBright',
            'yellowBright',
            'blueBright',
            'magentaBright',
            'cyanBright',
            'whiteBright',
            'bgBlack',
            'bgRed',
            'bgGreen',
            'bgYellow',
            'bgBlue',
            'bgMagenta',
            'bgCyan',
            'bgWhite',
            'bgGray',
            'bgGrey',
            'bgBlackBright',
            'bgRedBright',
            'bgGreenBright',
            'bgYellowBright',
            'bgBlueBright',
            'bgMagentaBright',
            'bgCyanBright',
            'bgWhiteBright'
        ].forEach(key => {
            const result = colors[key]('text');
            expect(result).toEqual(chalk[key]('text'));
        });
    });
});
