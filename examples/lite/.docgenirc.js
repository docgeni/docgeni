/**
 * @type {import('@docgeni/core').DocgeniConfig}
 */
module.exports = {
    mode: 'lite',
    title: 'Lite Mode',
    description: 'A documentation generator for Angular',
    docsDir: 'docs',
    navs: [
        null,
        {
            title: 'GitHub',
            path: 'https://github.com/docgeni/docgeni',
            isExternal: true
        }
    ],
    footer: 'Open-source MIT Licensed | Copyright © 2020-present Powered by self'
};
