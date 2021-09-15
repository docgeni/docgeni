import { shell } from '../lib';
import { contributors, lastUpdatedTime } from '../lib/git';

describe('git', () => {
    it('should get lastUpdatedTime with name quotation', () => {
        const time = Math.floor(Date.now() / 1000);
        const fileName = `"test a".js`;
        spyOn(shell, 'spawnSync').and.callFake((command, args, options) => {
            expect(command).toBe('git');
            expect(args).toEqual([`log`, `--pretty=format:"%at"`, '-n', '1', fileName]);
            return {
                stdout: Buffer.from(`"${time}"`)
            } as any;
        });
        const result = lastUpdatedTime(fileName);
        expect(result).toBe(time);
    });
    it('should get lastUpdatedTime with name space ', () => {
        const time = Math.floor(Date.now() / 1000);
        const fileName = `test a.js`;
        spyOn(shell, 'spawnSync').and.callFake((command, args, options) => {
            expect(command).toBe('git');
            expect(args).toEqual([`log`, `--pretty=format:"%at"`, '-n', '1', fileName]);
            return {
                stdout: Buffer.from(`"${time}"`)
            } as any;
        });
        const result = lastUpdatedTime(fileName);
        expect(result).toBe(time);
    });
    it('should get contributors', () => {
        const fileName = `"test a".js`;
        spyOn(shell, 'spawnSync').and.callFake((command, args, options) => {
            expect(command).toBe('git');
            expect(args).toEqual([`log`, `--pretty=format:"%an"`, fileName]);
            return {
                stdout: Buffer.from(`"a"
"b"`)
            } as any;
        });
        const result = contributors(fileName);
        expect(result).toEqual(['a', 'b']);
    });
});
