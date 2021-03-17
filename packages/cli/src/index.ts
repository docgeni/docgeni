import * as yargs from 'yargs';
import { buildCommand } from './build';
import { serveCommand } from './serve';
import { DEFAULT_CONFIG } from '@docgeni/core';
import { initCommand } from './init';

const argv = yargs
    .scriptName('docgeni')
    .usage('Usage: $0 <build|dev|init> [options]')
    .option('docs-path', {
        desc: `Docs folder path`,
        default: DEFAULT_CONFIG.docsPath
    })
    .command(buildCommand)
    .command(serveCommand)
    .command(initCommand)
    .demandCommand(1, 'must provide a valid command')
    .detectLocale(false)
    .wrap(120)
    .version()
    .showHelpOnFail(false)
    .help().argv;

const command = argv._[0] as string;

if (!['build', 'dev', 'serve', 'init'].includes(command)) {
    yargs.showHelp();
}
