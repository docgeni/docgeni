import { Docgeni, DEFAULT_CONFIG, DocgeniConfig, DocgeniContext, AngularJsonBuilder } from '../src';
import { expect } from 'chai';
import { toolkit } from '@docgeni/toolkit';
import { basicFixturePath } from './fixtures';
import path from 'path';

describe('#build-angular-json', () => {
    beforeEach(() => {
        toolkit.initialize({
            baseDir: path.resolve(__dirname, '../src')
        });
    });

    it(`should build angular json success`, async () => {
        const ctx = {
            paths: {
                cwd: basicFixturePath
            },
            config: {
                siteDir: '.docgeni',
                output: 'dist/docgeni-site'
            }
        } as DocgeniContext;
        const angularJsonBuilder = new AngularJsonBuilder(ctx);
        await angularJsonBuilder.build();
        // await angularJsonBuilder.emit();
        expect(angularJsonBuilder['angularJson']).deep.eq({
            root: '.docgeni',
            outputPath: 'dist/docgeni-site'
        });
    });
});
