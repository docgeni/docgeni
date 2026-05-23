import { Token, TokenizerAndRendererExtension } from 'marked';

export interface TabItemToken {
    label: string;
    tokens: Token[];
}

export interface TabsToken {
    type: 'tabs';
    raw: string;
    tabs: TabItemToken[];
}

const TABS_BLOCK_RULE = /^<tabs>\s*([\s\S]*?)\s*<\/tabs>/i;
const TAB_ITEM_RULE = /<tab\s+label=(['"])(.*?)\1\s*>([\s\S]*?)<\/tab>/gi;

function escapeAttr(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

export const tabs: TokenizerAndRendererExtension = {
    name: 'tabs',
    level: 'block',
    start(src: string) {
        return src.match(/<tabs\b/i)?.index;
    },
    tokenizer(src: string) {
        const match = TABS_BLOCK_RULE.exec(src);
        if (!match) {
            return;
        }

        const inner = match[1];
        const tabItems: TabItemToken[] = [];
        let tabMatch: RegExpExecArray | null;
        TAB_ITEM_RULE.lastIndex = 0;

        while ((tabMatch = TAB_ITEM_RULE.exec(inner)) !== null) {
            const tokens: Token[] = [];
            const content = tabMatch[3].trim();
            if (content) {
                this.lexer.blockTokens(content, tokens);
            }
            tabItems.push({
                label: tabMatch[2].trim(),
                tokens,
            });
        }

        if (tabItems.length === 0) {
            return;
        }

        const token: TabsToken = {
            type: 'tabs',
            raw: match[0],
            tabs: tabItems,
        };
        return token;
    },
    renderer(token: TabsToken) {
        const tabsHtml = token.tabs.map((tab) => `<tab label="${escapeAttr(tab.label)}">${this.parser.parse(tab.tokens)}</tab>`).join('');
        return `<tabs>${tabsHtml}</tabs>\n`;
    },
};
