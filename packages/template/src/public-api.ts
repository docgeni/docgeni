/*
 * Public API Surface of @docgeni/template
 */

export * from './module';
export * from './shared/shared.module';
export * from './pages/pages.module';
export * from './services/public-api';
export * from './built-in/index';
// It will warn Circular dependence when export from /services/public-api
export * from './services/router-reset.service';
export * from './routes';
export * from './interfaces/public-api';
export * from './initializer';
export { DocgeniBuiltInComponent, addBuiltInComponents, BuiltInComponentDef } from './built-in';
