import { Plugin } from './plugin';
import { IDocgeni } from '../docgeni.interface';

export class AngularLibPlugin implements Plugin {
    apply(docgeni: IDocgeni): void {
        console.log(`AngularLibPlugin Load Success`);
        // builder.hooks.docCompile.tap('MarkdownPlugin', docSourceFile => {
        //     docSourceFile.content = docSourceFile.content + 'end';
        // });
    }
}

module.exports = AngularLibPlugin;
