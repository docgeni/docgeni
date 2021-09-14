import { timestamp } from './timestamp';

describe('#timestamp', () => {
    it('should get correct format', () => {
        const result = timestamp('YYYY-MM-DD HH:mm:ss');
        const now = new Date();
        expect(result.startsWith(`${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`)).toBeTruthy();
        expect(result.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)).toBeTruthy();
    });

    it('should get correct format by default format and now date', () => {
        const now = new Date();
        const result = timestamp();
        expect(result.startsWith(`${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`)).toBeTruthy();
        expect(result.match(/\d{4}-\d{2}-\d{2}/)).toBeTruthy();
    });

    it('should get correct format by default format and input date', () => {
        const date = new Date('2020-10-24');
        const result = timestamp(date);
        expect(result).toEqual('2020-10-24');
    });

    it('should get correct format by format and input date', () => {
        const date = new Date('2020-10-24 12:10:20');
        const result = timestamp('YYYY/MM/DD HH/mm/ss', date);
        expect(result).toEqual(`2020/10/24 12/10/20`);
    });

    it('should get correct format when set utc as true', () => {
        const date = new Date('2020-10-24 12:10:20');
        const result = timestamp('YYYY/MM/DD HH/mm/ss', date, true);
        expect(result).toEqual(`2020/10/24 04/10/20`);
    });

    it('should get correct format use utc', () => {
        const date = new Date('2020-10-24 12:10:20');
        const result = timestamp.utc('YYYY/MM/DD HH/mm/ss', date);
        expect(result).toEqual(`2020/10/24 04/10/20`);
    });
});
