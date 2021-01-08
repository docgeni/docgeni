import { AngularCommandOptions } from '@docgeni/core';

export function normalizeCommandArgsForAngular(args: any): AngularCommandOptions {
    return {
        port: args.port,
        prod: args.prod,
        deployUrl: args.deployUrl,
        baseHref: args.baseHref,
        skipSite: args.skipSite
    };
}
