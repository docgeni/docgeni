import { expect } from 'chai';
import { normalizeCommandArgsForAngular } from '../src/angular-args';
import * as path from 'path';
import * as fs from 'fs';
const options = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/ng-build-options.json')).toString());
describe('angular-args', () => {
    it('should get undefined when normalize empty object', () => {
        const result = normalizeCommandArgsForAngular({}, options);
        expect(result).deep.eq({
            port: undefined,
            prod: undefined,
            deployUrl: undefined,
            baseHref: undefined,
            skipSite: undefined
        });
    });

    it('should get correct values when normalize', () => {
        const args = {
            port: 4700,
            prod: true,
            deployUrl: '/static/docgeni/',
            baseHref: '/docgeni/',
            skipSite: true
        };
        const result = normalizeCommandArgsForAngular(args, options);
        expect(result).deep.eq({
            port: args.port,
            prod: args.prod,
            deployUrl: args.deployUrl,
            baseHref: args.baseHref,
            skipSite: args.skipSite
        });
    });

    it('should filter undefined values when normalize', () => {
        const args = {
            port1: 4700,
            prod1: true
        };
        const result = normalizeCommandArgsForAngular(args, options);
        expect(result).deep.eq({
            port: undefined,
            prod: undefined,
            deployUrl: undefined,
            baseHref: undefined,
            skipSite: undefined
        });
    });
    it('should support ng args', () => {
        const args = {
            verbose: true,
            aot: true
        };
        const result = normalizeCommandArgsForAngular(args, options);
        expect(result).deep.eq({
            port: undefined,
            prod: undefined,
            deployUrl: undefined,
            baseHref: undefined,
            skipSite: undefined,
            verbose: true,
            aot: true
        });
    });
    it('should match with camelize', () => {
        const args = {
            'cross-origin': true
        };
        const result = normalizeCommandArgsForAngular(args, options);
        console.log(result);
        expect(result).deep.eq({
            port: undefined,
            prod: undefined,
            deployUrl: undefined,
            baseHref: undefined,
            skipSite: undefined,
            ['cross-origin']: true
        });
    });
});
