import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { BuiltInParserName, LiteralUnion, format as prettierFormat } from 'prettier';
export function format(filePath: string, type: LiteralUnion<BuiltInParserName>): Rule {
    return (host: Tree, context: SchematicContext) => {
        let fileContent = host.read(filePath).toString();
        fileContent = prettierFormat(fileContent, { parser: type });
        host.overwrite(filePath, fileContent);
        return host;
    };
}
