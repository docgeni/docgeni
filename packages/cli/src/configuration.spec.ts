import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { getConfiguration } from './configuration';

describe('configuration', () => {
    it('should load .docgenirc.ts configuration', () => {
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'docgeni-config-'));
        fs.writeFileSync(
            path.join(tempDir, '.docgenirc.ts'),
            `export default {
  mode: 'full',
  title: 'Test Docgeni',
};
`,
        );
        const originalCwd = process.cwd();
        try {
            process.chdir(tempDir);
            const config = getConfiguration();
            expect(config.mode).toBe('full');
            expect(config.title).toBe('Test Docgeni');
        } finally {
            process.chdir(originalCwd);
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });
});
