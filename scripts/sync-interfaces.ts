import { toolkit } from '@docgeni/toolkit';

/**
 * sync @docgeni/core/interfaces to @docgeni/template/interfaces
 */
async function main() {
    await toolkit.fs.copy('./packages/core/src/interfaces', './packages/template/src/interfaces');
}

main();
