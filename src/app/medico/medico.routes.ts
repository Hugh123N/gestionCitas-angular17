import { Routes } from "@angular/router";
import { HomeComponent } from "./componentes/home/home.component";
import { CalendarioComponent } from "./componentes/calendario/calendario.component";
import { RecetasComponent } from "./componentes/recetas/recetas.component";

export const medicoRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'calendario', component: CalendarioComponent },
    { path: 'recetas', component: RecetasComponent },

];