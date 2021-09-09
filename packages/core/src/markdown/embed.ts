import { toolkit } from '@docgeni/toolkit';
import * as path from 'path';
import fm from 'front-matter';
import { RendererExtension, TokenizerExtension } from 'marked';

export function getEmbedBody(input: string, url: string) {
    input = input.replace(/\r\n|\r/g, '\n').replace(/\t/g, '    ');
    // TODO: add hash
    return fm(input).body;
}

export interface EmbedToken {
    type: 'embed';
    raw: string;
    src: string;
    tokens: [];
    message?: string;
}

export const embed: TokenizerExtension & RendererExtension = {
    name: 'embed',
    level: 'block',
    start(src: string) {
        return src.match(/<embed/)?.index;
    },
    tokenizer(src: string, tokens: any[]) {
        const rule = /^<embed\W*src=['"]([^"']*)\W*\/?>(<\/embed>?)/gi; // Regex for the complete token
        const match = rule.exec(src);
        if (match) {
            const token: EmbedToken = {
                // Token to generate
                type: 'embed',
                raw: match[0],
                src: match[1].trim(),
                tokens: []
            };

            // eslint-disable-next-line dot-notation
            const absFilePath: string = this.lexer.options['absFilePath'];
            const absDirPath = path.dirname(absFilePath);
            const nodeAbsPath = path.resolve(absDirPath, token.src);
            if (nodeAbsPath !== absFilePath && toolkit.fs.pathExistsSync(nodeAbsPath)) {
                const content = toolkit.fs.readFileSync(nodeAbsPath).toString();
                this.lexer.blockTokens(getEmbedBody(content, token.src), token.tokens);
            } else {
                token.message = `can't resolve path ${token.src}`;
            }
            return token;
        }
    },
    renderer(token: EmbedToken) {
        return `<div embed src="${token.src}">${token.message ? token.message : this.parser.parse(token.tokens)}</div>`;
    }
};
