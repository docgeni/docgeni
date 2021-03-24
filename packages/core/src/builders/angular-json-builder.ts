import { DocgeniContext } from '../docgeni.interface';
import * as path from 'path';
import { toolkit } from '@docgeni/toolkit';
import { SyncHook } from 'tapable';

interface AngularJsonData {
    root?: string;
    outputPath?: string;
}

export class AngularJsonBuilder {
    private sitePath: string;

    private angularJson: AngularJsonData = {};

    public hooks = {
        buildAngularJsonSucceed: new SyncHook<AngularJsonBuilder>(['angularJsonBuilder'])
    };

    constructor(private docgeni: DocgeniContext) {
        this.sitePath = path.resolve(this.docgeni.paths.cwd, this.docgeni.config.siteDir);
    }

    public async build() {
        this.angularJson = {
            root: this.docgeni.config.siteDir,
            outputPath: path.relative(this.docgeni.config.siteDir, this.docgeni.config.output)
        };
        this.hooks.buildAngularJsonSucceed.call(this);
    }

    public async emit() {
        await toolkit.fs.ensureFile(path.resolve(this.sitePath, './angular.json'));
        await toolkit.template.generate('angular-json.hbs', path.resolve(this.sitePath, './angular.json'), this.angularJson);
    }
}
