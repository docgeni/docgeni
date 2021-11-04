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
        [...list, ...entryFiles].forEach(item => {
            form.appendChild(this.createFormInput(`files[${item.path}]`, item.content));
        });
        form.appendChild(this.createFormInput(`dependencies`, JSON.stringify(dependencies)));
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }
}
