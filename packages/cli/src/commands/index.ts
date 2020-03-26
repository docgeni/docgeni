import yargs from 'yargs';
import { buildCommand } from './build';
import { serveCommand } from './serve';
import { getConfiguration } from '../configuration';
import { DEFAULT_CONFIG } from '../interfaces';

const argv = yargs
    .scriptName('docg')
    .usage('Usage: $0 <build|dev> [options]')
    .option('docs-folder', {
        desc: `Docs folder path`,
        default: DEFAULT_CONFIG.docsFolder
    })
    .command(buildCommand)
    .command(serveCommand)
    .demandCommand(1, 'must provide a valid command')
    .detectLocale(false)
    .wrap(120)
    .version()
    .showHelpOnFail(false)
    .pkgConf('wpm')
    .config(getConfiguration())
    .help().argv;

const command = argv._[0];

if (!['build', 'dev', 'serve'].includes(command)) {
    yargs.showHelp();
}
