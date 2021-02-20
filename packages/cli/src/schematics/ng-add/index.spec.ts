import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';

import { createTestWorkspaceFactory, getJsonFileContent } from '../testing';
import { addPackageToPackageJson } from '../utils';
import { VERSION } from '../../version';

describe('ng-add Schematic', () => {
    let tree: Tree;
    const schematicRunner = new SchematicTestRunner('docgeni', require.resolve('../collection.json'));

    let workspaceTree: UnitTestTree;

    beforeEach(async () => {
        const factory = createTestWorkspaceFactory(schematicRunner);
        await factory.create();
        await factory.addApplication({ name: 'docgeni-test-simple' });
        tree = factory.getTree();
    });

    it('should update package.json', async () => {
        workspaceTree = await schematicRunner.runSchematicAsync('ng-add', undefined, tree).toPromise();
        const packageJson = getJsonFileContent(workspaceTree, '/package.json');
        const dependencies = packageJson.dependencies;
        expect(dependencies['@docgeni/cli']).toEqual(VERSION);
        expect(schematicRunner.tasks.some(task => task.name === 'node-package')).toBe(true);
    });

    it('should respect version range from CLI ng-add command', async () => {
        // Simulates the behavior of the CLI `ng add` command. The command inserts the
        // requested package version into the `package.json` before the actual schematic runs.
        addPackageToPackageJson(tree, '@docgeni/cli', '^1.0.0');

        workspaceTree = await schematicRunner.runSchematicAsync('ng-add', {}, tree).toPromise();
        const packageJson = getJsonFileContent(workspaceTree, '/package.json');
        const dependencies = packageJson.dependencies;

        expect(dependencies['@docgeni/cli']).toBe('^1.0.0');
        expect(schematicRunner.tasks.some(task => task.name === 'node-package')).toBe(true);
    });
});
