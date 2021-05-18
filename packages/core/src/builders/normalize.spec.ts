import { normalizeLibConfig } from './normalize';
import { toolkit } from '@docgeni/toolkit';

describe('normalize', () => {
    describe('LibConfig', () => {
        it('should normalize lib config success for min inputs', () => {
            const result = normalizeLibConfig({ name: 'tethys', rootDir: './packages/alib' });
            expect(result).toEqual({
                name: 'tethys',
                rootDir: './packages/alib',
                abbrName: 'tethys',
                include: [],
                exclude: [],
                docDir: 'doc',
                apiDir: 'api',
                examplesDir: 'examples',
                categories: []
            });
        });

        it('should normalize lib config success for all custom inputs', () => {
            const input = {
                name: toolkit.strings.generateRandomId(),
                rootDir: toolkit.strings.generateRandomId(),
                abbrName: toolkit.strings.generateRandomId(),
                include: toolkit.strings.generateRandomId(),
                exclude: toolkit.strings.generateRandomId(),
                docDir: toolkit.strings.generateRandomId(),
                apiDir: toolkit.strings.generateRandomId(),
                examplesDir: toolkit.strings.generateRandomId(),
                categories: [
                    {
                        id: toolkit.strings.generateRandomId(),
                        title: toolkit.strings.generateRandomId(),
                        locales: {
                            'zh-cn': {
                                title: toolkit.strings.generateRandomId()
                            }
                        }
                    }
                ]
            };
            const result = normalizeLibConfig(input);
            expect(result).toEqual(input);
        });
    });
});
