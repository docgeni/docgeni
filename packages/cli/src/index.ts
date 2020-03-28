import { readdirSync, readFileSync } from 'fs';
import { resolve } from 'path';
import * as chokidar from 'chokidar';
import { getConfiguration } from './configuration';
import { Markdown } from './markdown';
import { logger } from './utils/logger';

async function main() {
    const config = getConfiguration();
    const docsFolder = resolve(process.cwd(), config.docsPath);
    const subFolders = readdirSync(docsFolder);

    const watcher = chokidar.watch(docsFolder, {});
    watcher.on('change', (path, stats) => {
        logger.info(path);
        console.log(stats);
    });
    // const source = readFileSync(resolve(docsFolder, './guides/getting-started.md'), 'UTF-8');
    // const result = Markdown.toHTML(source);
    // logger.info(docsFolder, 'hello', 'word');
    // logger.info(subFolders);
    // logger.info(result);
}

main();
