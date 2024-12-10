import { colors } from './colors';
import { Spinner } from './spinner';
import { generateRandomId } from './strings';

describe('#spinner', () => {
    function fakeSpinner(spinner: Spinner) {
        return ((spinner as any).spinner = {
            isSpinning: false,
            text: undefined,
            start(text: string) {
                this.isSpinning = true;
                this.text = text;
            },
            stop() {
                this.isSpinning = false;
            },
            succeed() {},
            info() {},
            warn() {},
            fail() {},
        });
    }

    it('should create success', () => {
        const text = generateRandomId();
        const spinner = new Spinner(text);
        expect(spinner).toBeTruthy();
        expect(spinner.text).toEqual(text);
        expect(spinner.isSpinning).toEqual(false);
    });

    it('should start success', () => {
        const text = generateRandomId();
        const spinner = new Spinner();
        fakeSpinner(spinner);
        spinner.start(text);
        expect(spinner.text).toEqual(text);
        expect(spinner.isSpinning).toEqual(true);
    });

    it('should stop success', () => {
        const text = generateRandomId();
        const spinner = new Spinner();
        fakeSpinner(spinner);
        spinner.start(text);
        spinner.stop();
        expect(spinner.text).toEqual(text);
        expect(spinner.isSpinning).toEqual(false);
    });

    it('should set text success', () => {
        const text = generateRandomId();
        const spinner = new Spinner();
        fakeSpinner(spinner);
        spinner.text = text;
        expect(spinner.text).toEqual(text);
    });

    it('should log success', () => {
        const spinner = new Spinner();
        const fake = fakeSpinner(spinner);
        ['succeed', 'info', 'warn', 'fail'].forEach((type: 'succeed' | 'info' | 'warn' | 'fail') => {
            const text = generateRandomId();
            const spy = spyOn(fake, type);
            expect(spy).not.toHaveBeenCalled();
            spinner[type](text);
            expect(spy).toHaveBeenCalledWith(type === 'fail' ? colors.redBright(text) : text);
        });
    });

    it('should disabled', () => {
        const spinner = new Spinner();
        spinner.enabled = false;
        expect(spinner.text).toEqual(undefined);
        expect(spinner.isSpinning).toEqual(false);
        spinner.start();
        expect(spinner.text).toEqual(undefined);
        expect(spinner.isSpinning).toEqual(false);
        spinner.info(generateRandomId());
        expect(spinner.text).toEqual(undefined);
        expect(spinner.isSpinning).toEqual(false);
        spinner.warn(generateRandomId());
        expect(spinner.text).toEqual(undefined);
        expect(spinner.isSpinning).toEqual(false);
        spinner.fail(generateRandomId());
        expect(spinner.text).toEqual(undefined);
        expect(spinner.isSpinning).toEqual(false);
        spinner.stop();
        expect(spinner.text).toEqual(undefined);
        expect(spinner.isSpinning).toEqual(false);
    });
});
