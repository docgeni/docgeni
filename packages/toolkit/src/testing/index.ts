// TODO: replace this with an "it()" macro that's reusable globally.
let linuxOnlyIt: typeof it = it;
let linuxAndDarwinIt: typeof it = it;
if (process.platform.startsWith('win') || process.platform.startsWith('darwin')) {
    linuxOnlyIt = xit;
}
if (process.platform.startsWith('win')) {
    linuxAndDarwinIt = xit;
}

export { linuxOnlyIt, linuxAndDarwinIt };

export * from './fs';
