import { Pipe, PipeTransform, inject } from '@angular/core';
import { GlobalContext } from '../../services/global-context';

@Pipe({ name: 'dgAssetsContentPath' })
export class AssetsContentPathPipe implements PipeTransform {
    private globalContext = inject(GlobalContext);

    transform(path: string): string {
        return this.globalContext.getAssetsContentPath(path);
    }
}
