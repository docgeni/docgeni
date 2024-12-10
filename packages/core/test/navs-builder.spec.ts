import { toolkit } from '@docgeni/toolkit';
import { DocgeniContext } from '../src/docgeni.interface';
import { DocItem } from '../src/interfaces';
import { NavsBuilder } from './../src/builders/navs-builder';
import { expect } from 'chai';

function generateDocItem(path = toolkit.strings.generateRandomId()): DocItem {
    return { id: path, path: path, title: toolkit.strings.generateRandomId() };
}

describe('#navs-builder', () => {
    describe('#getFullRoutePath', () => {
        let navBuilder: NavsBuilder;

        beforeEach(() => {
            navBuilder = new NavsBuilder({
                config: {
                    title: '',
                    navs: [],
                },
            } as DocgeniContext);
        });

        it('should get correct path with parent and current', () => {
            const parentItem = generateDocItem();
            const result = navBuilder['getFullRoutePath']('current', parentItem);
            expect(result).eq(`${parentItem.path}/current`);
        });

        it('should get current path with parent is null', () => {
            const result = navBuilder['getFullRoutePath']('current', null);
            expect(result).eq(`current`);
        });

        it('should get empty path when current path is equal parent path and is entry', () => {
            const parentItem = generateDocItem();
            const result = navBuilder['getFullRoutePath'](parentItem.path, parentItem, true);
            expect(result).eq(``);
        });

        it('should get correct path with parent and current and is entry', () => {
            const parentItem = generateDocItem('parent');
            const result = navBuilder['getFullRoutePath']('current', parentItem, true);
            expect(result).eq(`${parentItem.path}`);
        });

        it('should get parent path when current path is undefined', () => {
            const parentItem = generateDocItem('parent');
            const result = navBuilder['getFullRoutePath'](undefined, parentItem, true);
            expect(result).eq(`${parentItem.path}`);
        });

        it('should get parent path when current path is null', () => {
            const parentItem = generateDocItem('parent');
            const result = navBuilder['getFullRoutePath'](null, parentItem, true);
            expect(result).eq(`${parentItem.path}`);
        });

        it('should get parent path when current path is empty', () => {
            const parentItem = generateDocItem('parent');
            const result = navBuilder['getFullRoutePath']('', parentItem, true);
            expect(result).eq(`${parentItem.path}`);
        });
    });
});
