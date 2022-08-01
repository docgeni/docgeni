import { NgDocParser } from '../src';
import * as path from 'path';
import { toolkit } from '@docgeni/toolkit';
import { Project, Node } from 'ts-morph';
import ts from 'typescript';

const EXCLUDE_DIRS: string[] = [];
const ONLY_TEST_FIXTURE = 'full';
const ROOT_FIXTURES = path.resolve(__dirname, '../test/fixtures');

function objectContaining<T>(object: T) {
    if (toolkit.utils.isArray(object)) {
        return jasmine.arrayContaining(
            object.map(item => {
                return objectContaining(item);
            })
        );
    } else if (typeof object === 'object') {
        for (const key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
                const element = object[key];
                if (toolkit.utils.isArray(element) || typeof element === 'object') {
                    object[key] = objectContaining(element);
                }
            }
        }
        return jasmine.objectContaining(object);
    } else {
        return object;
    }
}

function testAllFixtures() {
    const root = path.resolve(__dirname, '../test/fixtures');
    const dirs = toolkit.fs.readdirSync(root);
    for (const dir of dirs) {
        if (ONLY_TEST_FIXTURE && ONLY_TEST_FIXTURE !== dir) {
            continue;
        }
        if (!EXCLUDE_DIRS.includes(dir)) {
            it(`should parse success for case: ${dir}`, async () => {
                const input = path.resolve(root, `${dir}/input/*.ts`);
                const outputPath = path.resolve(root, `${dir}/output.json`);
                const output = toolkit.fs.readJSONSync(outputPath);
                // console.time('NgDocParser');
                const docs = NgDocParser.parse(input);
                // console.timeEnd('NgDocParser');
                // console.log(JSON.stringify(docs, null, 2));
                expect(docs).toEqual(objectContaining(output));
            });
        }
    }
}

describe('#parser', () => {
    testAllFixtures();

    xit('perf compare', () => {
        const input = path.resolve(ROOT_FIXTURES, `full/input/*.ts`);
        const filePaths = toolkit.fs.globSync(input);
        console.time('createProgram');
        const program = ts.createProgram(filePaths, { skipLibCheck: true, skipDefaultLibCheck: true }, undefined, undefined, []);
        console.timeEnd('createProgram');

        console.time('createProgram1');
        const program1 = ts.createProgram(filePaths, { skipLibCheck: true, skipDefaultLibCheck: true }, undefined);
        console.timeEnd('createProgram1');

        console.time('createProgram2');
        const options: ts.CompilerOptions = {};
        const host: ts.CompilerHost = {
            fileExists: filePath => {
                return toolkit.fs.pathExistsSync(filePath);
            },
            directoryExists: dirPath => dirPath === '/',
            getCurrentDirectory: () => '/',
            getDirectories: () => [],
            getCanonicalFileName: fileName => fileName,
            getNewLine: () => '\n',
            getDefaultLibFileName: () => '',
            getSourceFile: filePath => {
                const text = toolkit.fs.readFileSync(filePath, { encoding: 'utf-8' });
                return ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest);
            },
            readFile: filePath => {
                return toolkit.fs.readFileSync(filePath, { encoding: 'utf-8' });
            },
            useCaseSensitiveFileNames: () => true,
            writeFile: () => {}
        };
        const program2 = ts.createProgram({
            options,
            rootNames: filePaths,
            host: host
        });
        console.timeEnd('createProgram2');

        console.time('tsMorph');
        const project = new Project({});
        project.addSourceFilesAtPaths(input);
        const d111 = project.getProgram().compilerObject; //.getTypeChecker().compilerObject;
        console.timeEnd('tsMorph');

        console.time('tsMorph1');
        const project1 = new Project({});
        project1.addSourceFilesAtPaths(input);
        const d1 = project1.getProgram().compilerObject; //.getTypeChecker().compilerObject;
        project1.addSourceFilesAtPaths(path.resolve(ROOT_FIXTURES, `property-ref-enum/input/*.ts`));
        const d11 = project1.getProgram().compilerObject;
        console.timeEnd('tsMorph1');
    });

    xit('parse TETHYS', () => {
        const tethysRootPath = '/Users/haifeng/IT/10_YC/Worktile/ngx-tethys';
        const dirs = toolkit.fs.globSync(`${tethysRootPath}/src/*`);
        console.time('TETHYS');
        const ngDocParser = new NgDocParser({ fileGlobs: `${tethysRootPath}/src/*/{*[!spec].ts,!(examples|api|test)/**/*[!spec].ts}` });
        let total = 0;
        dirs.forEach(dir => {
            if (toolkit.fs.isDirectory(dir)) {
                const docs = NgDocParser.parse(`${dir}/{*[!spec].ts,!(examples|api|test)/**/*[!spec].ts}`);
                total += docs.length;
            }
        });
        // console.log(JSON.stringify(docs, null, 2));
        console.log(`generate docs: ${total}`);
        console.timeEnd('TETHYS');
    });
});
