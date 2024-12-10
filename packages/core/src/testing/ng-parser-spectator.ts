import { DefaultNgParserHost, DefaultNgParserHostOptions, NgDocParser, NgDocParserOptions, NgParserHost, ts } from '@docgeni/ngdoc';

export class NgParserSpectator {
    private createNgParserHostSpy: jasmine.Spy<(options: DefaultNgParserHostOptions) => NgParserHost>;
    private createNgParserSpy: jasmine.Spy<(options: NgDocParserOptions) => NgDocParser>;
    public mockNgParserHost: NgParserHost;
    public mockNgParser: NgDocParser;
    private ngParserHostOptions: DefaultNgParserHostOptions;

    constructor() {
        this.createNgParserHostSpy = spyOn(DefaultNgParserHost, 'create');
        this.createNgParserSpy = spyOn(NgDocParser, 'create');
        this.mockNgParserHost = {
            program: {} as unknown as ts.Program,
        };
        this.mockNgParser = {} as unknown as NgDocParser;
        this.createNgParserHostSpy.and.callFake((options) => {
            this.ngParserHostOptions = options;
            return this.mockNgParserHost;
        });
        this.createNgParserSpy.and.returnValue(this.mockNgParser);
    }

    notHaveBeenCalled() {
        expect(this.createNgParserHostSpy).not.toHaveBeenCalled();
        expect(this.createNgParserSpy).not.toHaveBeenCalled();
    }

    toHaveBeenCalled(expected: { tsConfigPath?: string; rootDir?: string; watch?: boolean }) {
        expect(this.createNgParserHostSpy).toHaveBeenCalled();
        expect(this.createNgParserSpy).toHaveBeenCalledWith({
            ngParserHost: this.mockNgParserHost,
        });
        const args = this.createNgParserHostSpy.calls.argsFor(0);
        expect(args[0]).toBeTruthy();
        expect(args[0].tsConfigPath).toEqual(expected.tsConfigPath);
        expect(args[0].rootDir).toEqual(expected.rootDir);
        expect(args[0].watch).toEqual(expected.watch);
    }

    fakeFileChange(filepath: string) {
        this.ngParserHostOptions.watcher('update', filepath);
    }
}
