const env = process.env.DOCGENI_ENV;
if (['development', 'test'].includes(env)) {
    require('./src/index');
} else {
    require('./lib/index');
}
