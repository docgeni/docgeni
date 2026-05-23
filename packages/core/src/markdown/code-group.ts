import { Token, TokenizerAndRendererExtension } from 'marked';

export interface CodeGroupTabItem {
    label: string;
    tokens: Token[];
}

export interface CodeGroupToken {
    type: 'codeGroup';
    raw: string;
    tabs: CodeGroupTabItem[];
}

const CODE_GROUP_BLOCK_RULE = /^:::\s*code-group\s*\n([\s\S]*?)\n:::\s*(?:\n|$)/;
const CODE_BLOCK_RULE = /```([^\n`]*)\r?\n([\s\S]*?)```/g;

function escapeAttr(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function parseCodeBlockInfo(info: string): { lang?: string; label: string } {
    const trimmed = info.trim();
    const labelMatch = trimmed.match(/\[([^\]]+)\]/);
    const label = labelMatch?.[1]?.trim();
    const lang = trimmed.replace(/\[[^\]]+\]/, '').trim() || undefined;
    return {
        lang,
        label: label || lang || 'Code',
    };
}

export const codeGroup: TokenizerAndRendererExtension = {
    name: 'codeGroup',
    level: 'block',
    start(src: string) {
        return src.match(/^:::\s*code-group\b/m)?.index;
    },
    tokenizer(src: string) {
        const match = CODE_GROUP_BLOCK_RULE.exec(src);
        if (!match) {
            return;
        }

        const inner = match[1];
        const tabItems: CodeGroupTabItem[] = [];
        let codeMatch: RegExpExecArray | null;
        CODE_BLOCK_RULE.lastIndex = 0;

        while ((codeMatch = CODE_BLOCK_RULE.exec(inner)) !== null) {
            const { lang, label } = parseCodeBlockInfo(codeMatch[1]);
            const code = codeMatch[2].replace(/\n$/, '');
            const markdown = lang ? `\`\`\`${lang}\n${code}\n\`\`\`` : `\`\`\`\n${code}\n\`\`\``;
            const tokens: Token[] = [];
            this.lexer.blockTokens(markdown, tokens);
            tabItems.push({ label, tokens });
        }

        if (tabItems.length === 0) {
            return;
        }

        const token: CodeGroupToken = {
            type: 'codeGroup',
            raw: match[0],
            tabs: tabItems,
        };
        return token;
    },
    renderer(token: CodeGroupToken) {
        const tabsHtml = token.tabs
            .map((tab) => {
                return `<tab label="${escapeAttr(tab.label)}">${this.parser.parse(tab.tokens)}</tab>`;
            })
            .join('');
        return `<tabs mode="code-group">${tabsHtml}</tabs>\n`;
    },
};
