import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: 'paciente',
        //canMatch: [RoleGuard], // evita que el módulo se cargue si no tiene el rol
        loadChildren: () =>
            import('./paciente/paciente.routes').then(m => m.pacienteRoutes),
        //data:{roles: ['paciente'],['admin']}
    },
    {
        path: 'medico',
        //canMatch: [RoleGuard], // evita que el módulo se cargue si no tiene el rol
        loadChildren: () =>
            import('./medico/medico.routes').then(m => m.medicoRoutes),
        //data:{roles: ['medico']. ['admin']}
    },
    { path: '', redirectTo: '/login', pathMatch: 'full' }

];
