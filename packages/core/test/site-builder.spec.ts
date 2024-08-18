import { Docgeni, DEFAULT_CONFIG, DocgeniConfig, DocgeniContext, SiteBuilder } from '../src';
import { toolkit } from '@docgeni/toolkit';
import { basicFixturePath, createTestDocgeniContext } from '../src/testing';
import path from 'path';
import { DocgeniPaths } from '../src/docgeni-paths';

// describe('#site-builder', () => {
//     let context: DocgeniContext;
//     beforeEach(() => {
//         toolkit.initialize({
//             baseDir: path.resolve(__dirname, '../src')
//         });
//         context = createTestDocgeniContext();
//     });

//     fit(`should build angular json success`, async () => {
//         const siteBuilder = new SiteBuilder(context);
//         spyOn(context.host, 'copy').and.callFake(path => {
//             // expect(path).toContain('site-template');
//             return null;
//         });
//         await siteBuilder.build();
//         // TODO: add assertions
//     });
// });
