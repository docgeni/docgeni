import { CommandModule } from 'yargs';
import { Docgeni, DocgeniConfig, DEFAULT_CONFIG } from '@docgeni/core';

export const serveCommand: CommandModule = {
    command: ['serve'],
    describe: 'Serve documentation site for development',
    builder: yargs => {
        yargs.option('docs-folder', {
            desc: `Docs folder path`,
            default: DEFAULT_CONFIG.docsPath
        });

        return yargs;
    },
    handler: async (argv: any) => {
        const config = argv as DocgeniConfig;
        const docgeni = new Docgeni({
            watch: true,
            config
        });
        docgeni.run();
    }
};
