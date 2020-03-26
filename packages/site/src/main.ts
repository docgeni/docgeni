import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}


platformBrowserDynamic().bootstrapModule(AppModule);
// const bootstrap = () => {
//     console.log('bootstrap');
//     return platformBrowserDynamic().bootstrapModule(AppModule);
// };

// if (environment.hmr) {
//     if (module['hot']) {
//         hmrBootstrap(module, bootstrap);
//     } else {
//         console.error('HMR is not enabled for webpack-dev-server!');
//         console.log('Are you using the --hmr flag for ng serve?');
//     }
// } else {
//     bootstrap().catch(err => console.log(err));
// }
