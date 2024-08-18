import typescriptEslint from '@typescript-eslint/eslint-plugin';
import _import from 'eslint-plugin-import';
import { fixupPluginRules } from '@eslint/compat';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';

export default [
    {
        files: ['./packages/?(cli|core|toolkit)/src/**/*.ts'],
        plugins: {
            '@typescript-eslint': typescriptEslint,
            import: fixupPluginRules(_import),
        },

        languageOptions: {
            globals: {
                ...Object.fromEntries(Object.entries(globals.browser).map(([key]) => [key, 'off'])),
                ...globals.node,
            },

            parser: tsParser,
            ecmaVersion: 6,
            sourceType: 'module',

            parserOptions: {
                warnOnUnsupportedTypeScriptVersion: false,
            },
        },

        rules: {
            '@typescript-eslint/adjacent-overload-signatures': 'error',
            camelcase: 'off',

            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: 'interface',
                    format: ['PascalCase'],

                    custom: {
                        regex: '^I[A-Z]',
                        match: false,
                    },
                },
                {
                    selector: 'class',
                    format: ['PascalCase'],
                },
                {
                    selector: 'function',
                    format: ['camelCase'],
                },
                {
                    selector: 'enum',
                    format: ['PascalCase'],
                },
                {
                    selector: 'enumMember',
                    format: ['PascalCase', 'camelCase'],
                },
                {
                    selector: 'method',
                    format: ['camelCase', 'snake_case'],
                    leadingUnderscore: 'allow',
                },
                {
                    selector: 'accessor',
                    format: ['camelCase'],
                },
                {
                    selector: 'parameter',
                    format: ['camelCase', 'snake_case', 'PascalCase'],
                    leadingUnderscore: 'allow',
                },
                {
                    selector: 'typeAlias',
                    format: ['PascalCase'],
                },
                {
                    selector: 'typeParameter',
                    format: ['PascalCase'],
                },
            ],

            '@typescript-eslint/no-misused-new': 'error',
            '@typescript-eslint/no-this-alias': 'error',
            'no-unused-expressions': 'off',

            '@typescript-eslint/no-unused-expressions': [
                'error',
                {
                    allowTernary: true,
                },
            ],

            '@typescript-eslint/prefer-for-of': 'error',
            '@typescript-eslint/prefer-namespace-keyword': 'error',
            quotes: 'off',

            '@typescript-eslint/quotes': [
                'error',
                'single',
                {
                    avoidEscape: true,
                    allowTemplateLiterals: true,
                },
            ],

            semi: 'error',
            '@typescript-eslint/semi': 'error',
            'space-before-function-paren': 'off',

            '@typescript-eslint/space-before-function-paren': [
                'off',
                {
                    asyncArrow: 'always',
                    anonymous: 'always',
                    named: 'never',
                },
            ],

            '@typescript-eslint/triple-slash-reference': 'error',
            '@typescript-eslint/type-annotation-spacing': 'error',
            '@typescript-eslint/unified-signatures': 'error',

            'brace-style': [
                'error',
                '1tbs',
                {
                    allowSingleLine: true,
                },
            ],

            'constructor-super': 'error',
            curly: ['error', 'multi-line'],
            'dot-notation': 'error',
            eqeqeq: 'error',
            'linebreak-style': ['error', 'unix'],
            'new-parens': 'error',
            'no-caller': 'error',
            'no-duplicate-case': 'error',
            'no-duplicate-imports': 'error',
            'no-empty': 'error',
            'no-eval': 'error',
            'no-extra-bind': 'error',
            'no-fallthrough': 'error',
            'no-new-func': 'error',
            'no-new-wrappers': 'error',
            'no-return-await': 'error',

            'no-restricted-globals': [
                'error',
                {
                    name: 'setTimeout',
                },
                {
                    name: 'clearTimeout',
                },
                {
                    name: 'setInterval',
                },
                {
                    name: 'clearInterval',
                },
                {
                    name: 'setImmediate',
                },
                {
                    name: 'clearImmediate',
                },
            ],

            'no-sparse-arrays': 'error',
            'no-template-curly-in-string': 'error',
            'no-throw-literal': 'error',
            'no-trailing-spaces': 'error',
            'no-undef-init': 'error',
            'no-unsafe-finally': 'error',
            'no-unused-labels': 'error',
            'no-var': 'error',
            'prefer-const': 'error',
            'prefer-object-spread': 'error',
            'quote-props': ['error', 'consistent-as-needed'],
            'space-in-parens': 'error',
            'unicode-bom': ['error', 'never'],
            'use-isnan': 'error',
        },
    },
];
