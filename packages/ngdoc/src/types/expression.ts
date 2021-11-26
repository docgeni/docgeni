export type ArgumentInfo = string | string[] | { [key: string]: ArgumentInfo };

export interface ParsedCallExpressionInfo {
    name: string;
    argumentInfo?: ArgumentInfo[];
    arguments?: string[];
}
