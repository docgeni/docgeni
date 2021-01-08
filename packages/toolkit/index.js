const env = process.env.NODE_ENV;
if (['development', 'test'].includes(env)) {
    module.exports = require('./src/index');
} else {
    module.exports = require('./lib/index');
}
