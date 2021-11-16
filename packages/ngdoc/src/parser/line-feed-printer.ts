import { ts } from '../typescript';

/**
 * Platform consistent TypeScript printer instance. By default, TypeScript will use the
 * new-line kind based on the operating system (e.g. Windows will use CRLF).
 */
export const lineFeedPrinter: ts.Printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
    removeComments: true
});
