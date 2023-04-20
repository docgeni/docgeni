import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
// import { DEPENDENCIES } from '../dependencies';
import { createTestWorkspaceFactory, getJsonFileContent, TestWorkspaceFactory } from '../testing';
import { addPackageToPackageJson } from '../utils';
import { ANGULAR_VERSION, VERSION } from '../../version';
import { addPackageJsonDependency, NodeDependencyType } from '@schematics/angular/utility/dependencies';
import { toolkit } from '@docgeni/toolkit';
import path from 'node:path';

describe('ng-add Schematic', () => {
    let tree: Tree;

    let schematicRunner: SchematicTestRunner;

    let workspaceTree: UnitTestTree;

    let factory: TestWorkspaceFactory;

    beforeEach(async () => {
        schematicRunner = new SchematicTestRunner('docgeni', require.resolve('../collection.json'));
        factory = createTestWorkspaceFactory(schematicRunner);
        await factory.create();
        await factory.addApplication({ name: 'docgeni-test-simple' });
        tree = factory.getTree();
    });

    it('should update package.json devDependencies', async () => {
        workspaceTree = await schematicRunner.runSchematicAsync('ng-add', undefined, tree).toPromise();
        const packageJson = getJsonFileContent(workspaceTree, '/package.json');
        const devDependencies = packageJson[NodeDependencyType.Dev];
        expect(devDependencies['@docgei/angular']).toBeFalsy();
        expect(devDependencies['@docgeni/template']).toEqual(VERSION);
        expect(devDependencies['@docgeni/cli']).toEqual(VERSION);
        expect(schematicRunner.tasks.some(task => task.name === 'node-package')).toBe(true);
    });

    it('should update package.json devDependencies without @angular/core', async () => {
        let packageJson = JSON.parse(tree.read('/package.json').toString());
        delete packageJson[NodeDependencyType.Default]['@angular/core'];
        tree.overwrite('/package.json', JSON.stringify(packageJson));
        workspaceTree = await schematicRunner.runSchematic('ng-add', undefined, tree);
        packageJson = getJsonFileContent(workspaceTree, '/package.json');
        const devDependencies = packageJson[NodeDependencyType.Dev];
        expect(devDependencies['@docgei/angular']).toEqual(ANGULAR_VERSION);
    });

    it('should update package.json command', async () => {
        workspaceTree = await schematicRunner.runSchematic('ng-add', undefined, tree);
        const packageJson = getJsonFileContent(workspaceTree, '/package.json');
        expect(packageJson.scripts['start:docs']).toEqual('docgeni serve --port 4600');
        expect(packageJson.scripts['build:docs']).toEqual('docgeni build');
    });

    it('should init .docgenirc.js', async () => {
        const mode = 'full';
        const docsDir = 'test-docs';
        workspaceTree = await schematicRunner.runSchematic('ng-add', { mode, docsDir }, tree);
        const exist = workspaceTree.exists('.docgenirc.js');
        expect(exist).toBeTruthy();
        const config = workspaceTree.read('.docgenirc.js').toString();
        expect(config).toContain(`mode: '${mode}'`);
        expect(config).toContain(`docsDir: '${docsDir}'`);
        expect(config).toContain(`@type {import('@docgeni/core').DocgeniConfig}`);
        const packageJson = getJsonFileContent(workspaceTree, '/package.json');
        expect(config).toContain(`title: '${packageJson.name}'`);
    });

    it('should create docsDir', async () => {
        workspaceTree = await schematicRunner.runSchematic('ng-add', undefined, tree);
        workspaceTree.getDir('docs');
        expect(workspaceTree.getDir('docs').subfiles.length).toBeTruthy();
        expect(workspaceTree.exists(`docs/getting-started.md`)).toBeTruthy();
    });

    it('should has library', async () => {
        const libraryName = 'lib-test';
        await factory.addLibrary({ name: libraryName });
        tree = factory.getTree();
        workspaceTree = await schematicRunner.runSchematic('ng-add', undefined, tree);
        const config = workspaceTree.read('.docgenirc.js').toString();
        expect(config).toContain(`rootDir: 'projects/${libraryName}'`);
        expect(config).toContain(`lib: '${libraryName}'`);
        expect(config).toContain(`apiMode: 'automatic'`);
        const expectContent = await toolkit.fs.readFileContent(
            path.resolve(__dirname, '../../../test/fixtures/docgenirc/output/.docgenirc.js')
        );
        expect(toolkit.strings.compatibleNormalize(config)).toEqual(toolkit.strings.compatibleNormalize(expectContent));
    });

    it('should generate without angular.json', async () => {
        const libraryName = 'lib-test';
        await factory.addLibrary({ name: libraryName });
        factory.removeFile('angular.json');
        tree = factory.getTree();
        workspaceTree = await schematicRunner.runSchematic('ng-add', undefined, tree);
        const config = workspaceTree.read('.docgenirc.js').toString();
        expect(config).not.toContain(`libs: `);
        expect(config).not.toContain(`navs: `);
    });

    it('should create .gitignore if not exist', async () => {
        factory.removeFile('.gitignore');
        tree = factory.getTree();
        workspaceTree = await schematicRunner.runSchematic('ng-add', undefined, tree);
        expect(workspaceTree.exists('.gitignore')).toBeTruthy();
        const gitignoreContent = workspaceTree.read('.gitignore').toString();
        expect(gitignoreContent).toContain('.docgeni/site');
    });

    it('should has `.docgeni/site` in .gitignore', async () => {
        tree = factory.getTree();
        workspaceTree = await schematicRunner.runSchematic('ng-add', undefined, tree);
        expect(workspaceTree.exists('.gitignore')).toBeTruthy();
        const gitignoreContent = workspaceTree.read('.gitignore').toString();
        expect(gitignoreContent.split('\n').some(item => item === '.docgeni/site')).toBeTruthy();
    });
});
