import { NgDocParser } from '../src';
import * as path from 'path';
import { Project } from 'ts-morph';
import { ObjectLiteralExpression } from 'typescript';

describe('#parser', () => {
    it('should parse success', () => {
        const entries = NgDocParser.parse(path.resolve(__dirname, '../test/fixtures/basic/*.ts'));
        // console.log(JSON.stringify(entries, null, 2));
        expect(entries).toEqual([
            {
                type: 'component',
                name: 'LoadingComponent',
                description: 'General Loading Component description.',
                selector: 'thy-loading',
                templateUrl: './loading.component.html',
                template: null,
                styleUrls: ['./loading.component.scss'],
                styles: null,
                exportAs: null,
                properties: []
            },
            {
                type: 'component',
                name: 'ButtonComponent',
                description: 'General Button Component description.\nFor Book',
                selector: 'thy-button',
                templateUrl: './button.component.html',
                template: null,
                styleUrls: ['./button.component.scss'],
                styles: null,
                exportAs: null,
                properties: [
                    {
                        kind: 'input',
                        name: 'thyType',
                        type: '"primary" | "info" | "success"',
                        description: 'Button Type',
                        options: ['primary', 'info', 'success'],
                        jsDocTags: [],
                        default: 'primary'
                    },
                    {
                        kind: 'input',
                        name: 'thySize',
                        type: 'ButtonSize',
                        description: 'Button Size',
                        options: null,
                        jsDocTags: [],
                        default: null
                    },
                    {
                        kind: 'output',
                        name: 'thyLoadingEvent',
                        type: 'EventEmitter<boolean>',
                        description: 'Loading Event',
                        options: null,
                        jsDocTags: [],
                        default: 'new EventEmitter<boolean>()'
                    }
                ]
            },
            {
                type: 'directive',
                name: 'ButtonIconComponent',
                description: 'General Button Icon Directive description.',
                selector: '[thyButtonIco]',
                templateUrl: null,
                template: null,
                styleUrls: null,
                styles: null,
                exportAs: null,
                properties: []
            }
        ]);
    });
});
