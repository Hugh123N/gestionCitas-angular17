
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ServiceService } from '../../../service/service.service';


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
  @Input() formGroup!: FormGroup;
  @Output() medicoSeleccionado = new EventEmitter<any>();

  medicos: any[] = [];
  cargando = true;

  constructor(private service: ServiceService){}

  ngOnInit() {
    this.cargando = true;
    
    this.service.getMedicos().subscribe({
      next: (res: any) => {
        setTimeout(() => {
          this.medicos = res.medicos.map((c:any) => ({
            id: c.idUsuario,
            nombre: 'Dr(a). ' + c.nombre,
            apellido: c.apellido,
            especialidad: c.especialidad
          }));
          this.cargando = false;
        }, 1000);
      },
      error: (err) => {
        console.error('Error al obtener medicos:', err);
      }
    });

  }

  onChange(medicoId: number) {
    const seleccionado = this.medicos.find(m => m.id === medicoId);
    this.medicoSeleccionado.emit(seleccionado);
  }
}
