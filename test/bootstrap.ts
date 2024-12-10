import Jasmine from 'jasmine';
// import JasmineConsoleReporter from 'jasmine-console-reporter';
import { SpecReporter, StacktraceOption } from 'jasmine-spec-reporter';
import path from 'path';

async function main() {
    const runner = new Jasmine({});
    const reporter = new SpecReporter({
        spec: {
            displayPending: true,
            displayErrorMessages: true,
            displayStacktrace: StacktraceOption.PRETTY,
        },
        summary: {
            displayDuration: false,
        },
    });
    runner.env.clearReporters();
    runner.env.addReporter(reporter as any);
    runner.loadConfigFile(path.resolve(__dirname, './support/jasmine.json'));
    await runner.execute();
}

main();
