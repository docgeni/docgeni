import { Print } from './print';
import { colors } from './colors';
import chalk from 'chalk';

describe('#print', () => {
    let logSpy: jasmine.Spy;

    beforeEach(() => {
        logSpy = spyOn(console, 'log');
    });

    it('should get colors', () => {
        const print = new Print();
        expect(print.colors).toBe(colors);
    });

    it('should get chalk', () => {
        const print = new Print();
        expect(print.chalk).toBe(chalk);
    });

    it('should print success', () => {
        const print = new Print();
        const levelColors = {
            info: 'blue',
            success: 'green',
            debug: 'cyan',
            warn: 'yellow',
            error: 'red'
        };
        Object.keys(levelColors).forEach(key => {
            print[key]('text');
            expect(logSpy).toHaveBeenCalledWith(chalk[levelColors[key]]('text'));
        });
    });

    it('should print fancy success', () => {
        const print = new Print();
        print.fancy('text');
        expect(logSpy).toHaveBeenCalledWith('text');
    });

    it('should print error success', () => {
        const print = new Print();
        const errorSpy = spyOn(console, 'error');
        const error = new Error('test error');
        print.error(error);
        expect(errorSpy).toHaveBeenCalledWith(error);
    });

    it('should print with timePrefix', () => {
        const print = new Print({ timePrefix: true });
        print.fancy('text');
        const text: string = logSpy.calls.argsFor(0)[0];
        expect(text.includes('text'));
        expect(text.match(/[.*]/));
    });

    it('should print with custom prefix=hello', () => {
        const print = new Print({ prefix: 'hello' });
        print.fancy('text');
        const text: string = logSpy.calls.argsFor(0)[0];
        expect(text.includes('text'));
        expect(text.match(/[hello]/));
    });

    it('should print with custom prefix function', () => {
        const print = new Print({
            prefix: () => {
                return 'hello';
            }
        });
        print.fancy('text');
        const text: string = logSpy.calls.argsFor(0)[0];
        expect(text.includes('text'));
        expect(text.match(/[hello]/));
    });
});
