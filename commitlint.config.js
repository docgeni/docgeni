module.exports = {
    extends: ['@commitlint/config-angular'],
    rules: {
        'header-max-length': [2, 'always', 140],
        'scope-enum': [2, 'always', ['cli', 'core', 'template', 'alib', 'ngdoc', 'toolkit', 'deps', 'examples']],
    },
};
