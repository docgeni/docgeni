import { Plugin } from '../plugins';
import { DocgeniContext } from '../docgeni.interface';
import { Detector } from './detector';
import { SiteBuilder } from './site-builder';
import { AngularCommander } from './ng-commander';
import { extractAngularCommandArgs, readNgBuildOptions, readNgServeOptions } from './utils';

const NAME = 'AngularSitePlugin';

export class AngularSitePlugin implements Plugin {
    ngCommander: AngularCommander;

    apply(context: DocgeniContext): void {
        context.hooks.run.tapPromise(NAME, async () => {
            const detector = new Detector(context);
            await detector.detect();
            const siteBuilder = new SiteBuilder(context);
            const siteProject = await siteBuilder.build(detector.siteProject);
            this.ngCommander = new AngularCommander(context, siteProject);
            context.enableIvy = detector.enableIvy;
        });

        context.hooks.done.tapPromise(NAME, async () => {
            const { skipSite } = context.config as { skipSite: boolean };
            if (!skipSite) {
                const ngCommandArgs = extractAngularCommandArgs(
                    context.config,
                    context.watch ? readNgServeOptions() : readNgBuildOptions()
                );
                this.ngCommander.run(ngCommandArgs, context.watch);
            }
        });
    }
}

module.exports = AngularSitePlugin;
