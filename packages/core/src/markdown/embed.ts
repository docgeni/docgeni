import { toolkit } from '@docgeni/toolkit';
import * as path from 'path';
import { relative } from '../fs';

const EMBED_REGEX = /<embed\W*src=['"]([^"']*)\W*\/?>(<\/embed>?)/gi;

export interface EmbedNode {
    origin: string;
    src: string;
}

function getEmbedNodes(input: string) {
    const regex = /<embed\W*src=['"]([^"']*)\W*\/?>(<\/embed>?)/g;
    const nodes: EmbedNode[] = [];
    let matches: RegExpExecArray;
    while ((matches = regex.exec(input))) {
        nodes.push({
            origin: matches[0],
            src: matches[1]
        });
    }
    return nodes;
}

export function transformEmbed(input: string, absFilePath: string) {
    const nodes = getEmbedNodes(input);
    const embedsContentMap: Record<string, string> = {};
    nodes.forEach(node => {
        const absDirPath = path.dirname(absFilePath);
        const nodeAbsPath = path.resolve(absDirPath, node.src);
        if (nodeAbsPath !== absFilePath && toolkit.fs.pathExistsSync(nodeAbsPath)) {
            const content = toolkit.fs.readFileSync(nodeAbsPath).toString();
            embedsContentMap[node.src] = transformEmbed(content, nodeAbsPath);
        } else {
            embedsContentMap[node.src] = `can't resolve path ${node.src}`;
        }
    });

    return input.replace(EMBED_REGEX, (_match: string, src: string) => {
        return embedsContentMap[src];
    });
}
