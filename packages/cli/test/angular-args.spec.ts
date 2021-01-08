import { expect } from 'chai';
import { normalizeCommandArgsForAngular } from '../src/angular-args';

describe('angular-args', () => {
    it('should get undefined when normalize empty object', () => {
        const result = normalizeCommandArgsForAngular({});
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
        const result = normalizeCommandArgsForAngular(args);
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
        const result = normalizeCommandArgsForAngular(args);
        expect(result).deep.eq({
            port: undefined,
            prod: undefined,
            deployUrl: undefined,
            baseHref: undefined,
            skipSite: undefined
        });
    });
});
