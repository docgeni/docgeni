import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';

export function getJsonFileContent(tree: UnitTestTree, path: string) {
    return JSON.parse(tree.readContent(path));
}
