import { Component } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';
import { FormBuilder, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ServiceService } from '../../../service/service.service';
import { CitaService } from '../../../service/cita.service';

import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-agenda-fecha',
  standalone: true,
  imports: [   MatDatepickerModule,
    MatNativeDateModule, FormsModule, CommonModule, MatStepperModule, MatFormFieldModule, MatInputModule,
  MatSelectModule, MatCardModule, MatButtonModule, MatIconModule, FlexLayoutModule, ReactiveFormsModule],
  templateUrl: './agenda-fecha.component.html',
  styleUrl: './agenda-fecha.component.css'
})
export class AgendaFechaComponent {

  formEspecialidad = this.fb.group({ especialidad: [''] });
  formMedico = this.fb.group({ medico: [''] });
  formHorario = this.fb.group({ fecha: [''], hora: [''] });

  especialidad: any;
  medico: any;
  resumenCita: any;


  constructor(private router: Router, private route: ActivatedRoute, private service: ServiceService, private citaService: CitaService, private fb: FormBuilder) {
    
  }

  onEspecialidadSeleccionada(especialidad: any) {
    this.especialidad = especialidad;
  }

  onMedicoSeleccionado(medico: any) {
    this.medico = medico;
  }


  onHorarioSeleccionado(data: { fecha: string; hora: string }) {
    this.resumenCita = {
      especialidad: this.especialidad,
      medico: this.medico,
      ...data
    };
  }

  onConfirmar() {
    // Enviar a backend la cita completa
    // Mostrar snack o redirigir
  }

  volver() {
    this.router.navigate(['/paciente']);
  }

}

