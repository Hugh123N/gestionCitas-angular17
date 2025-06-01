import { Routes } from '@angular/router';
import { AppComponent } from './app.component'; // Layout con header/footer
import { LoginComponent } from './auth/login/login.component';

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
        // data: { roles: ['PACIENTE', 'ADMIN'] },
        // canMatch: [RoleGuard]
      },
      {
        path: 'medico',
        loadChildren: () =>
          import('./medico/medico.routes').then(m => m.medicoRoutes),
        // data: { roles: ['MEDICO', 'ADMIN'] },
        // canMatch: [RoleGuard]
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
        redirectTo: 'paciente', // o 'medico', o una página home, depende de login
        pathMatch: 'full'
      }
    ]
  },

  { path: '**', redirectTo: 'login' }
];
