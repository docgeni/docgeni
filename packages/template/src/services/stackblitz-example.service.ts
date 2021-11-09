import { Injectable } from '@angular/core';
import { ExampleService } from './example.service';

@Injectable({
    providedIn: 'root'
})
export class StackblitzExampleService extends ExampleService {
    private createFormInput(key: string, value: string) {
        const input = document.createElement('textarea');
        input.name = key;
        input.value = value;
        input.hidden = true;
        return input;
    }
    open(
        files: { path: string; content: string }[],
        module: {
            name: string;
            importSpecifier: string;
        },
        component: {
            name: string;
            selector: string;
        }
    ) {
        const form = document.createElement('form');
        form.hidden = true;
        form.target = '_blank';
        form.method = 'post';
        form.action = `https://run.stackblitz.com/api/angular/v1`;
        const entryFiles = this.generateEntryFile(module, component);
        const allFiles = [...entryFiles, ...files];
        const filesMap: Record<string, string> = {};
        allFiles.forEach(item => {
            filesMap[`files[${item.path}]`] = item.content;
        });
        for (const path in filesMap) {
            if (Object.prototype.hasOwnProperty.call(filesMap, path)) {
                const content = filesMap[path];
                form.appendChild(this.createFormInput(path, content));
            }
        }
        const packageJsonFile = allFiles.find(item => item.path === 'package.json');
        form.appendChild(this.createFormInput(`dependencies`, JSON.stringify(JSON.parse(packageJsonFile.content).dependencies)));
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }
}
