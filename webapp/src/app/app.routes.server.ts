import { RenderMode, ServerRoute } from '@angular/ssr';
import { authGuard } from '../guards/auth.guard';
import { ModuleDetailComponent } from './pages/module-detail/module-detail';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'modules/:id',
    renderMode: RenderMode.Server,
  },
];
