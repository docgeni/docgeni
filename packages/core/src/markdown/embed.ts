import { toolkit } from '@docgeni/toolkit';
import * as path from 'path';
import fm from 'front-matter';
import { RendererExtension, TokenizerExtension } from 'marked';
import { compatibleNormalize } from './utils';
const LINE_SEPARATE = /\r\n|\n|\r/;
export function getEmbedBody(input: string, range: [number, number], url: string) {
    if (range[0] && range[1]) {
        input = input
            .split(LINE_SEPARATE)
            .slice(range[0] - 1, range[1])
            .join('\n');
    } else if (range[0]) {
        input = input.split(LINE_SEPARATE)[range[0] - 1];
    }
    // TODO: add hash
    return fm(compatibleNormalize(input)).body;
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
            const rangeRule = /(#L(\d+)(-L(\d+))?)?$/;
            const rangeMatch = rangeRule.exec(match[1].trim());
            const token: EmbedToken = {
                // Token to generate
                type: 'embed',
                raw: match[0],
                src: match[1].trim().replace(rangeRule, ''),
                tokens: []
            };
            // eslint-disable-next-line dot-notation
            const absFilePath: string = this.lexer.options['absFilePath'];
            const absDirPath = path.dirname(absFilePath);
            const nodeAbsPath = path.resolve(absDirPath, token.src);
            if (nodeAbsPath !== absFilePath && toolkit.fs.pathExistsSync(nodeAbsPath)) {
                let content = toolkit.fs.readFileSync(nodeAbsPath).toString();
                this.lexer.blockTokens(
                    getEmbedBody(content, [parseInt(rangeMatch[2], 10), parseInt(rangeMatch[4], 10)], token.src),
                    token.tokens
                );
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
