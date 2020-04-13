const env = process.env.NODE_ENV;
if (env === 'development') {
    module.exports = require('./src/index');
} else {
    module.exports = require('./lib/index');
}
