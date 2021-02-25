const fs = require('fs');
const env = process.env.NODE_ENV;
if (['development', 'test'].includes(env)) {
    if (fs.existsSync('./src')) {
        module.exports = require('./src/index');
    } else {
        module.exports = require('./lib/index');
    }
} else {
    module.exports = require('./lib/index');
}
