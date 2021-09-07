import { Docgeni, DEFAULT_CONFIG, DocgeniConfig, DocgeniContext, SiteBuilder } from '../src';
import { expect } from 'chai';
import { toolkit } from '@docgeni/toolkit';
import { basicFixturePath } from '../src/testing';
import path from 'path';
import { DocgeniPaths } from '../src/docgeni-paths';

describe('#site-builder', () => {
    beforeEach(() => {
        toolkit.initialize({
            baseDir: path.resolve(__dirname, '../src')
        });
    });

    it(`should build angular json success`, async () => {
        const config: DocgeniConfig = {
            title: 'Docgeni Test',
            siteDir: '.docgeni/site',
            outputDir: 'dist/docgeni-site',
            publicDir: '.docgeni/public'
        };
        const paths = new DocgeniPaths(basicFixturePath, 'docs', config.outputDir);
        const ctx = {
            paths: paths,
            config: config
        } as DocgeniContext;
        const siteBuilder = new SiteBuilder(ctx);
        await siteBuilder.build();
        // TODO: add assertions
        // expect(angularJsonBuilder['angularJson']).deep.eq({
        //     root: '.docgeni/site',
        //     outputPath: '../../dist/docgeni-site'
        // });
    });
});
