const env = process.env.NODE_ENV;
if (env === 'development') {
    require('./src/commands/index');
} else {
    require('./lib/commands/index');
}
