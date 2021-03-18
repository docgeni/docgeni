import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
// import { DEPENDENCIES } from '../dependencies';
import { createTestWorkspaceFactory, getJsonFileContent, TestWorkspaceFactory } from '../testing';
import { addPackageToPackageJson } from '../utils';
import { VERSION } from '../../version';
import { addPackageJsonDependency, NodeDependencyType } from '@schematics/angular/utility/dependencies';

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
        expect(devDependencies['@docgeni/template']).toEqual(VERSION);
        expect(devDependencies['@docgeni/cli']).toEqual(VERSION);
        expect(schematicRunner.tasks.some(task => task.name === 'node-package')).toBe(true);
    });

    it('should update package.json command', async () => {
        workspaceTree = await schematicRunner.runSchematicAsync('ng-add', undefined, tree).toPromise();
        const packageJson = getJsonFileContent(workspaceTree, '/package.json');
        expect(packageJson.scripts['start:docs']).toEqual('docgeni serve --port 4600');
        expect(packageJson.scripts['build:docs']).toEqual('docgeni build --prod');
    });

    it('should init .docgenirc.js', async () => {
        const mode = 'full';
        const docsDir = 'test-docs';
        workspaceTree = await schematicRunner.runSchematicAsync('ng-add', { mode, docsDir }, tree).toPromise();
        const exist = workspaceTree.exists('.docgenirc.js');
        expect(exist).toBeTruthy();
        const config = workspaceTree.read('.docgenirc.js').toString();
        expect(config).toContain(`mode: '${mode}'`);
        expect(config).toContain(`docsDir: '${docsDir}'`);
        const packageJson = getJsonFileContent(workspaceTree, '/package.json');
        expect(config).toContain(`title: '${packageJson.name}'`);
    });

    it('should create docsDir', async () => {
        workspaceTree = await schematicRunner.runSchematicAsync('ng-add', undefined, tree).toPromise();
        workspaceTree.getDir('docs');
        expect(workspaceTree.getDir('docs').subfiles.length).toBeTruthy();
        expect(workspaceTree.exists(`docs/getting-started.md`)).toBeTruthy();
    });

    it('should has library', async () => {
        const libraryName = 'lib-test';
        await factory.addLibrary({ name: libraryName });
        tree = factory.getTree();
        workspaceTree = await schematicRunner.runSchematicAsync('ng-add', undefined, tree).toPromise();
        const config = workspaceTree.read('.docgenirc.js').toString();
        expect(config).toContain(`rootDir: 'projects/${libraryName}/src'`);
        expect(config).toContain(`lib: '${libraryName}'`);
    });

    it('should generate without angular.json', async () => {
        const libraryName = 'lib-test';
        await factory.addLibrary({ name: libraryName });
        factory.removeFile('angular.json');
        tree = factory.getTree();
        workspaceTree = await schematicRunner.runSchematicAsync('ng-add', undefined, tree).toPromise();
        const config = workspaceTree.read('.docgenirc.js').toString();
        expect(config).not.toContain(`libs: `);
        expect(config).not.toContain(`navs: `);
    });
});
