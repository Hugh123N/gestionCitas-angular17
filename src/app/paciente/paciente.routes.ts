import { Routes } from "@angular/router";
import { HomeComponent } from "./compoentes/home/home.component";
import { AgendaFechaComponent } from "./compoentes/agenda-fecha/agenda-fecha.component";
import { ConfirmarCitaComponent } from "./compoentes/confirmar-cita/confirmar-cita.component";
import { MisCitasComponent } from "./compoentes/mis-citas/mis-citas.component";
import { AgendaCitaComponent } from "./compoentes/agenda-cita/agenda-cita.component";
import { SeleccionarEspecialidadComponent } from "./compoentes/seleccionar-especialidad/seleccionar-especialidad.component";
import { SeleccionarMedicoComponent } from "./compoentes/seleccionar-medico/seleccionar-medico.component";

export const pacienteRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'agenda-cita', component: AgendaCitaComponent },
    { path: 'seleccionar-especialidad', component: SeleccionarEspecialidadComponent},
    { path: 'seleccionar-medico', component: SeleccionarMedicoComponent},
    { path: 'agenda-fecha', component: AgendaFechaComponent },
    { path: 'confirmar-cita', component: ConfirmarCitaComponent },
    { path: 'mis-citas', component: MisCitasComponent },
];