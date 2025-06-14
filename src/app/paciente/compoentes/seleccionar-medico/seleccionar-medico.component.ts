
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
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
export class SeleccionarMedicoComponent implements OnChanges{
  @Input() especialidad!: any;
  @Input() formGroup!: FormGroup;
  @Output() medicoSeleccionado = new EventEmitter<any>();

  medicos: any[] = [];
  cargando = true;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['especialidad'] && this.especialidad) {
      this.cargarMedicos();
    }
  }

  cargarMedicos() {
    this.cargando = true;
    // Simulación de llamada API
    setTimeout(() => {
      this.medicos = [
        { id: 10, nombre: 'Dr. Juan Pérez', especialidadId: this.especialidad.id },
        { id: 11, nombre: 'Dra. Laura Gómez', especialidadId: this.especialidad.id }
      ];
      this.cargando = false;
    }, 1000);
  }

  onChange(medicoId: number) {
    const seleccionado = this.medicos.find(m => m.id === medicoId);
    this.medicoSeleccionado.emit(seleccionado);
  }
}
