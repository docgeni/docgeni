import { NgDocParser, createNgParserHost } from '@docgeni/ngdoc';

const ngParserHost = createNgParserHost({
    tsConfigPath: 'tsconfig.json',
    fileGlobs: '',
    rootDir: process.cwd(),
    watch: true
});

const ngParser = NgDocParser.create({
    ngParserHost: ngParserHost
});

const docs = ngParser.parse(__dirname + '/button/*.ts');
console.log(JSON.stringify(docs, null, 2));
