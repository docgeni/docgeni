import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
    {
        path: '~examples/:name',
        renderMode: RenderMode.Client,
    },
    {
        path: '**',
        renderMode: RenderMode.Prerender,
    },
];
