import { CommandModule } from 'yargs';
import { main } from '@angular-devkit/schematics-cli/bin/schematics';
export const initCommand: CommandModule = {
    command: ['init'],
    describe: 'Init config',
    builder: yargs => {
        yargs.option('mode', {
            alias: 'm',
            desc: `Mode of documentation, full mode contains nav, home page, lite mode only contains menu and doc viewers`,
            default: 'lite',
            choices: ['lite', 'full']
        });

        return yargs;
    },
    handler: async argv => {
        main({ args: [`@docgeni/cli:ng-add`, `--mode`, `${argv.mode}`, `--docsPath`, `${argv.docsPath}`] })
            .then(exitCode => (process.exitCode = exitCode))
            .catch(e => {
                throw e;
            });
    }
};
