module.exports = {
    extends: ['@commitlint/config-angular'],
    rules: {
        'header-max-length': [2, 'always', 120],
        'scope-enum': [2, 'always', ['cli', 'core', 'template', 'a-lib', 'site', 'toolkit', 'deps']]
    }
};
