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
        list: { path: string; content: string }[],
        dependencies: Record<string, string>,
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
        let entryFiles = this.generateEntryFile(module, component);
        let allFiles = [...entryFiles, ...list];
        let obj = {};
        allFiles.forEach(item => {
            obj[`files[${item.path}]`] = item.content;
        });
        for (const path in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, path)) {
                const content = obj[path];
                form.appendChild(this.createFormInput(path, content));
            }
        }
        let packageJsonFile = allFiles.find(item => item.path === 'package.json');
        form.appendChild(this.createFormInput(`dependencies`, JSON.stringify(JSON.parse(packageJsonFile.content).dependencies)));
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }
}
