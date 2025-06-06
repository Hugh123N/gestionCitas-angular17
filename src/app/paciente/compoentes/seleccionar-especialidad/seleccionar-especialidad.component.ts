import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-seleccionar-especialidad',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ],
  templateUrl: './seleccionar-especialidad.component.html',
  styleUrl: './seleccionar-especialidad.component.css'
})
export class SeleccionarEspecialidadComponent implements OnInit{
  @Input() formGroup!: FormGroup;
  @Output() especialidadSeleccionada = new EventEmitter<any>();

  especialidades: any[] = [];
  cargando = true;

  ngOnInit() {
    // Simulación de llamada API
    setTimeout(() => {
      this.especialidades = [
        { id: 1, nombre: 'Cardiología' },
        { id: 2, nombre: 'Dermatología' },
        { id: 3, nombre: 'Pediatría' },
        { id: 4, nombre: 'Neurología' }
      ];
      this.cargando = false;
    }, 1000);
  }

  onChange(especialidadId: number) {
    const seleccionada = this.especialidades.find(e => e.id === especialidadId);
    this.especialidadSeleccionada.emit(seleccionada);
  }
}
