import { createPrinter, NewLineKind, Printer } from 'typescript';

/**
 * Platform consistent TypeScript printer instance. By default, TypeScript will use the
 * new-line kind based on the operating system (e.g. Windows will use CRLF).
 */
export const lineFeedPrinter: Printer = createPrinter({
    newLine: NewLineKind.LineFeed,
    removeComments: true
});
