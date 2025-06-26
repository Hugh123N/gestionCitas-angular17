import { Routes } from "@angular/router";
import { HomeComponent } from "./compoentes/home/home.component";
import { AgendaFechaComponent } from "./compoentes/agenda-fecha/agenda-fecha.component";
import { ConfirmarCitaComponent } from "./compoentes/confirmar-cita/confirmar-cita.component";
import { AgendaCitaComponent } from "./compoentes/agenda-cita/agenda-cita.component";
import { SeleccionarMedicoComponent } from "./compoentes/seleccionar-medico/seleccionar-medico.component";
import { DetalleCitaComponent } from "./compoentes/detalle-cita/detalle-cita.component";

export const pacienteRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'agenda-cita', component: AgendaCitaComponent },
    { path: 'seleccionar-medico', component: SeleccionarMedicoComponent},
    { path: 'agenda-fecha', component: AgendaFechaComponent },
    { path: 'confirmar-cita', component: ConfirmarCitaComponent },
    { path: 'detalle-cita/:id', component: DetalleCitaComponent },
];