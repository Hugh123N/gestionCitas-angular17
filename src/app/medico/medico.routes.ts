import { Routes } from "@angular/router";
import { HomeComponent } from "./componentes/home/home.component";
import { CalendarioComponent } from "./componentes/calendario/calendario.component";

export const medicoRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'calendario', component: CalendarioComponent },
];