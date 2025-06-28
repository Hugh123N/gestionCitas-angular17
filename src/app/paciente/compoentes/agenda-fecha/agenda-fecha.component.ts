import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';

import { FormBuilder, FormsModule, Validators } from '@angular/forms';

import { ActivatedRoute, Route, Router } from '@angular/router';
import { ServiceService } from '../../../service/service.service';
import { CitaService } from '../../../service/cita.service';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agenda-fecha',
  standalone: true,
  imports: [MatDatepickerModule,
    MatNativeDateModule, FormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, FlexLayoutModule, ReactiveFormsModule,
    MatButtonToggleModule, MatProgressSpinnerModule],
  templateUrl: './agenda-fecha.component.html',
  styleUrl: './agenda-fecha.component.css'
})


export class AgendaFechaComponent implements OnInit {
  @Input() medico!: any;
  @Input() formGroup!: FormGroup;
  @Output() horarioSeleccionado = new EventEmitter<{ fecha: string, hora: string }>();

  hoy: Date = new Date();
  fechaSeleccionada: Date | null = null;
  horarios: string[] = [];
  horariosOcupados: string[] = [];
  cargando = false;

  constructor(private service: ServiceService) {}

  ngOnInit(): void {
    if (!this.formGroup.get('hora')) {
      this.formGroup.addControl('hora', new FormBuilder().control('', Validators.required));
    }
  }

  onFechaChange(fecha: Date) {
    if (fecha < this.hoy) {
      // Resetear si eligió una fecha inválida
      this.formGroup.get('fecha')?.setValue(null);
        Swal.fire({
        icon: 'error',
        title: 'Fecha inválida',
        text: 'No se puede seleccionar una fecha anterior a hoy.',
        confirmButtonText: 'Entendido',
      });
      return;
    }

    this.fechaSeleccionada = fecha;
    this.formGroup.get('hora')?.reset(); // Limpia hora si cambia fecha
    this.cargarHorariosDisponibles(fecha);
  }

  cargarHorariosDisponibles(fecha: Date) {
    if (!this.medico?.id) return;

    this.cargando = true;
    const fechaStr = fecha.toISOString().split('T')[0];

    this.service.getHorariosDisponibles(this.medico.id, fechaStr).subscribe({
      next: (response) => {
        if (response.success) {
          this.horarios = response.data.horariosDisponibles || [];
          this.horariosOcupados = response.data.horariosOcupados || [];

          // Emitir si ya hay hora seleccionada válida
          const hora = this.formGroup.get('hora')?.value;
          if (hora) {
            this.horarioSeleccionado.emit({ fecha: fechaStr, hora });
          }
        } else {
          this.horarios = [];
          this.horariosOcupados = [];
          Swal.fire('Error', response.errorMsg || 'No se pudieron obtener horarios', 'error');
        }
        this.cargando = false;
      },
      error: (err) => {
        this.horarios = [];
        this.horariosOcupados = [];
        this.cargando = false;
        Swal.fire('Error', 'Error al obtener horarios desde el servidor', 'error');
        console.error(err);
      }
    });
  }

  
  isHoraOcupada(hora: string): boolean {
    return this.horariosOcupados.includes(hora); // ejemplo
  }

  onHoraSeleccionada(hora: string) {
    this.formGroup.get('hora')?.setValue(hora);
    if (this.fechaSeleccionada) {
      const fechaStr = this.fechaSeleccionada.toISOString().split('T')[0];
      this.horarioSeleccionado.emit({ fecha: fechaStr, hora });
    }
  }

}

