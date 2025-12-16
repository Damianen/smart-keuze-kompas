import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { ModulesListComponent } from './pages/modules-list/modules-list';
import { ModuleDetailComponent } from './pages/module-detail/module-detail';
import { authGuard } from '../guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'modules',
    component: ModulesListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'modules/:id',
    component: ModuleDetailComponent,
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
