import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AgendaFechaComponent } from './agenda-fecha/agenda-fecha.component';
import { ConfirmarCitaComponent } from './confirmar-cita/confirmar-cita.component';
import { MisCitasComponent } from './mis-citas/mis-citas.component';

export const routes: Routes = [
    {path:'login', component:LoginComponent},
    {path:'home', component:HomeComponent},
    {path:'agenda-fecha', component:AgendaFechaComponent},
    {path:'confirmar-cita', component:ConfirmarCitaComponent},
    {path:'mis-citas', component:MisCitasComponent},
    {path:'', redirectTo:'/login', pathMatch:'full'}

];
