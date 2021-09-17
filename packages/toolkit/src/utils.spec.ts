import { isUndefinedOrNull, keyBy, random, some, sortByOrderMap, uniq } from './utils';

describe('#utils', () => {
    describe('isUndefinedOrNull', () => {
        it('should get truly', () => {
            [undefined, null].forEach(value => {
                expect(isUndefinedOrNull(value)).toBe(true);
            });
        });

        it('should get falsely', () => {
            [{}, true, ''].forEach(value => {
                expect(isUndefinedOrNull(value)).toBe(false);
            });
        });
    });

    describe('sortByOrderMap', () => {
        it('should sort items success', () => {
            const obj1 = { id: 'obj1' };
            const obj2 = { id: 'obj2' };
            const obj3 = { id: 'obj3' };
            const obj4 = { id: 'obj4' };
            const ordersMap = new WeakMap<{ id: String }, number>();
            ordersMap.set(obj1, 100);
            ordersMap.set(obj2, 1);
            ordersMap.set(obj3, 10);
            const result = sortByOrderMap([obj1, obj4, obj3, obj2], ordersMap);
            expect(result).toEqual([obj2, obj3, obj1, obj4]);
        });
    });

    describe('uniq', () => {
        it('uniq numbers', () => {
            expect(uniq([1, 2, 1])).toEqual([1, 2]);
        });
    });

    describe('some', () => {
        it('some one object', () => {
            expect(some([{ id: 1 }, { id: 2 }, { id: 3 }], { id: 1 })).toEqual(true);
        });
    });

    describe('random', () => {
        it('random', () => {
            const number = random(1, 100);
            expect(number >= 1).toBe(true);
            expect(number < 100).toBe(true);
        });
    });

    describe('keyBy', () => {
        it('keyBy undefined', () => {
            const result = keyBy(undefined, 'id');
            expect(result).toEqual({});
        });

        it('keyBy', () => {
            const obj1 = { id: 'obj1' };
            const obj2 = { id: 'obj2' };
            const obj3 = { id: 'obj3' };
            const obj4 = { id: 'obj4' };
            const result = keyBy([obj1, obj2, obj3, obj4], 'id');
            expect(result).toEqual({
                obj1: obj1,
                obj2: obj2,
                obj3: obj3,
                obj4: obj4
            });
        });
    });
});
