// import { createTestHost } from '@docgeni/toolkit/src/testing';
// import { NgDocParser } from '../ng-parser';
// import { createNgParserHost } from '../ng-parser-host';

// export function createTestNgParserFsHost(files: Record<string, string>){
//     const host = createTestHost(files);
//     return {
//         fileExists: (path: string) => {
//             host.exists()
//         },
//         readFile: (path: string) => string;
//         writeFile: (path: string, data: string, writeByteOrderMark?: boolean) => void;
//         readDirectory: (
//             rootDir: string,
//             extensions: readonly string[],
//             excludes: readonly string[] | undefined,
//             includes: readonly string[],
//             depth?: number
//         ) => readonly string[];
//     }
// }

// export function createTestNgParserHost(component: string, files: Record<string, string>) {
//     return createNgParserHost({
//         fsHost: createTestHost(files)
//     });
// }

// export function createTestNgDocParser() {
//     return new NgDocParser({
//         ngParserHost: null
//     });
// }
