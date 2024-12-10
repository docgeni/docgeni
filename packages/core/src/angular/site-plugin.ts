import { Plugin } from '../plugins';
import { DocgeniContext } from '../docgeni.interface';
import { SiteBuilder } from './site-builder';
import { extractAngularCommandArgs, readNgBuildOptions, readNgServeOptions } from './utils';

const NAME = 'AngularSitePlugin';

export default class AngularSitePlugin implements Plugin {
    public siteBuilder: SiteBuilder;

    apply(context: DocgeniContext): void {
        context.hooks.beforeRun.tapPromise(NAME, async () => {
            this.siteBuilder = SiteBuilder.create(context);
            await this.siteBuilder.build();
            context.enableIvy = this.siteBuilder.enableIvy;
        });

        context.hooks.done.tapPromise(NAME, async () => {
            const { skipSite } = context.config as { skipSite: boolean };
            if (!skipSite) {
                const ngCommandArgs = extractAngularCommandArgs(
                    context.config,
                    context.watch ? readNgServeOptions() : readNgBuildOptions(),
                );
                await this.siteBuilder.runNgCommand(ngCommandArgs);
            }
        });
    }
}
