import { extractAngularCommandArgs, readNgBuildOptions, readNgServeOptions } from './utils';

const ngBuildOptions = readNgBuildOptions();

describe('#ng-utils', () => {
    describe('#extractAngularCommandArgs', () => {
        it('should extract angular command args', () => {
            const result = extractAngularCommandArgs(
                {
                    deployUrl: '/docgeni/',
                    ['deploy-url']: '/docgeni/',
                    notFoundUrl: '/not-found/',
                    ['not-found-url']: '/not-found/'
                },
                ngBuildOptions
            );
            expect(result).toEqual({
                ['deploy-url']: '/docgeni/'
            });
        });

        it(`should extract angular command args 'deploy-url'`, () => {
            const result = extractAngularCommandArgs(
                {
                    ['deploy-url']: '/docgeni/'
                },
                ngBuildOptions
            );
            expect(result).toEqual({
                ['deploy-url']: '/docgeni/'
            });
        });

        it(`should extract angular command args 'deployUrl'`, () => {
            const result = extractAngularCommandArgs(
                {
                    ['deployUrl']: '/docgeni/'
                },
                ngBuildOptions
            );
            expect(result).toEqual({
                ['deploy-url']: '/docgeni/'
            });
        });
    });

    describe('readCommandOptions', () => {
        it('should read build command options', () => {
            const ngOptions = readNgBuildOptions();
            expect(ngOptions).toBeTruthy();
            expect(ngOptions.length > 0).toBeTruthy();
        });

        it('should read serve command options', () => {
            const ngOptions = readNgServeOptions();
            expect(ngOptions).toBeTruthy();
            expect(ngOptions.length > 0).toBeTruthy();
        });
    });
});
