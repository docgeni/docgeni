import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { RootComponent } from './app/content/index';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) => bootstrapApplication(RootComponent, config, context);

export default bootstrap;
