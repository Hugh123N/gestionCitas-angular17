import { Routes } from '@angular/router';
import { AppComponent } from './app.component'; 
import { LoginComponent } from './auth/login/login.component';
import { RoleGuard } from './core/guards/role.guard';
import { NoAuthorizeComponent } from './auth/no-authorize/no-authorize.component';
import { DashboardComponent } from './auth/dashboard/dashboard.component';

export const routes: Routes = [

  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: 'paciente',
        loadChildren: () =>
          import('./paciente/paciente.routes').then(m => m.pacienteRoutes),
          data: { roles: ['Paciente', 'Admin'] },
          canMatch: [RoleGuard]
      },
      {
        path: 'medico',
        loadChildren: () =>
          import('./medico/medico.routes').then(m => m.medicoRoutes),
          data: { roles: ['Medico', 'Admin'] },
          canMatch: [RoleGuard]
      },
      /*{
        path: 'admin',
        loadChildren: () =>
          import('./admin/admin.routes').then(m => m.adminRoutes),
        // data: { roles: ['ADMIN'] },
        // canMatch: [RoleGuard]
      },*/
      {
        path: '',
        redirectTo: 'login', // o 'medico', o una página home, depende de login
        pathMatch: 'full'
      }
    ]
  },
  { path: 'Unauthorize', component: NoAuthorizeComponent },
  { path: '**', redirectTo: 'login' }
];
