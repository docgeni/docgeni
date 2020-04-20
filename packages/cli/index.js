const env = process.env.NODE_ENV;
if (env === 'development') {
    require('./src/index');
} else {
    require('./lib/index');
}
