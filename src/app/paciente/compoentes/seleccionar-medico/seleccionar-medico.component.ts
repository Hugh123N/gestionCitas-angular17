
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FlexLayoutModule } from '@angular/flex-layout';


@Component({
  selector: 'app-seleccionar-medico',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ],
  templateUrl: './seleccionar-medico.component.html',
  styleUrl: './seleccionar-medico.component.css'
})
export class SeleccionarMedicoComponent implements OnInit{
  @Input() especialidad!: any;
  @Input() formGroup!: FormGroup;
  @Output() medicoSeleccionado = new EventEmitter<any>();

  medicos: any[] = [];
  cargando = true;

  ngOnInit() {
    // Simulación de llamada API
    setTimeout(() => {
      if (this.especialidad) {
        this.medicos = [
          { id: 10, nombre: 'Dr. Juan Pérez', especialidadId: this.especialidad.id },
          { id: 11, nombre: 'Dra. Laura Gómez', especialidadId: this.especialidad.id }
        ];
      }
      this.cargando = false;
    }, 1000);
  }

  onChange(medicoId: number) {
    const seleccionado = this.medicos.find(m => m.id === medicoId);
    this.medicoSeleccionado.emit(seleccionado);
  }
}
