import { Pipe, PipeTransform } from '@angular/core';
import { GlobalContext } from '../../services/global-context';

@Pipe({ name: 'dgAssetsContentPath', standalone: false })
export class AssetsContentPathPipe implements PipeTransform {
    constructor(private globalContext: GlobalContext) {}

    transform(path: string): string {
        return this.globalContext.getAssetsContentPath(path);
    }
}
