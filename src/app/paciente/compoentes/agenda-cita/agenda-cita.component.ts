import { Component } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../../../service/service.service';
import { CitaService } from '../../../service/cita.service';
import { SeleccionarMedicoComponent } from '../seleccionar-medico/seleccionar-medico.component';
import { AgendaFechaComponent } from '../agenda-fecha/agenda-fecha.component';
import { ConfirmarCitaComponent } from '../confirmar-cita/confirmar-cita.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agenda-cita',
  standalone: true,
  imports: [MatDatepickerModule,
    MatNativeDateModule, FormsModule, CommonModule, MatStepperModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatCardModule, MatButtonModule, MatIconModule, FlexLayoutModule, ReactiveFormsModule,
    SeleccionarMedicoComponent, AgendaFechaComponent, ConfirmarCitaComponent
  ],
  templateUrl: './agenda-cita.component.html',
  styleUrl: './agenda-cita.component.css'
})
export class AgendaCitaComponent {

  formMedico = this.fb.group({ medico: ['', Validators.required] });
  formHorario = this.fb.group({
    fecha: ['', Validators.required],
    hora: ['', Validators.required]
  });

  medico: any;
  resumenCita: any;
  cita: any;
  idPaciente: number = 0;


  constructor(private router: Router, private route: ActivatedRoute, private service: ServiceService, private fb: FormBuilder) {

  }

  onMedicoSeleccionado(medico: any) {
    this.medico = medico;
  }


  onHorarioSeleccionado(data: { fecha: string; hora: string }) {
    this.resumenCita = {
      medico: this.medico,
      ...data
    };
  }

  onConfirmar() {
    const user = JSON.parse(localStorage.getItem('currentUser')!);

    const fechaCompleta = new Date(this.resumenCita.fecha); 
    const fecha = fechaCompleta.toISOString().split('T')[0]; 

    this.cita = {
      idMedico: this.resumenCita.medico.id,
      idPaciente: user.idUsuario,
      fecha: fecha,
      hora: this.resumenCita.hora
    }
    this.service.registrarCita(this.cita).subscribe({
      next: (data) => {
        Swal.fire({
        icon: data.status,
        title: '¡Cita confirmada!',
        text: 'Tu cita ha sido registrada exitosamente.',
        confirmButtonText: 'Ir al panel',
        confirmButtonColor: '#3085d6'
        }).then(() => {
          this.router.navigate(['/paciente']);
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: '¡Registro incorrecto!',
          text: err?.error?.message || 'Ocurrió un error',
          confirmButtonText: 'Intentelo otra vez',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          this.router.navigate(['/paciente/agenda-cita']);
        });
      },
    });
  }

  volver() {
    this.router.navigate(['/paciente']);
  }
}
