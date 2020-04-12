import { toolkit, fs } from '../src';
import * as path from 'path';
import { expect } from 'chai';

describe('#toolkit.template', () => {
    beforeEach(() => {
        toolkit.initialize({
            baseDir: path.resolve(__dirname)
        });
    });

    it('should compile success', () => {
        const result = toolkit.template.compile('module.hbs', {
            name: 'First Name'
        });
        expect(result).eq('This is template First Name\n');
    });

    it('should compile json success', () => {
        const result = toolkit.template.compile('config.hbs', {
            config: JSON.stringify(
                {
                    title: 'Title',
                    description: 'Description',
                    navs: [
                        {
                            title: 'getting started',
                            path: 'getting-started'
                        }
                    ]
                },
                null,
                4
            )
        });
        const expected = `export const config = {
    "title": "Title",
    "description": "Description",
    "navs": [
        {
            "title": "getting started",
            "path": "getting-started"
        }
    ]
};\n`;
        expect(result).eq(expected);
    });
});
