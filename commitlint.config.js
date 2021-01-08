module.exports = {
    extends: ['@commitlint/config-angular'],
    rules: {
        'scope-enum': [2, 'always', ['cli', 'core', 'template', 'a-lib', 'site', 'toolkit']]
    }
};
