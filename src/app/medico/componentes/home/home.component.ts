import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Cita } from '../../../interfaces/CitaMedica';
import { CitaPendienteService } from '../../../service/citapendiente.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  citaSeleccionada: any = null;



  citas = [
    {
      id: 1,
      tratamiento: 'Consulta general',
      fecha: '2025-05-14',
      horario: '10:00 a. m.',
      duracion: 30,
      nombre: 'María Rodríguez',
      medico: 'Dr. Ana García',
      estado: 'Finalizada',
      notas: 'Paciente presenta síntomas de resfriado. Se recomienda reposo.'
    },
    {
      id: 2,
      tratamiento: 'Seguimiento Cardiológico',
      fecha: '2025-05-18',
      horario: '09:00 a. m.',
      duracion: 45,
      nombre: 'Juan Gonzales',
      medico: 'Dr. Luis Vargas',
      estado: 'Pendiente',
      notas: 'Control de presión arterial y ritmo cardiaco.'
    }
  ];

  verDetalle(cita: any) {
    this.citaSeleccionada = cita;
  }

  regresar() {
    this.citaSeleccionada = null;
  }







}




//
// citas: Cita[] = []; // lista de citas a mostrar
// citaSeleccionada: Cita | null = null; // para mostrar detalles

//  constructor(private citaService: CitaPendienteService) { }

// ngOnInit(): void {
// this.cargarCitas(); // al iniciar, se cargan las citas
//}

// cargarCitas(): void {
//   this.citaService.lista().subscribe({
//    next: response => {
//     this.citas = response.value; // asumimos que la lista está en response.data
//  },
// error: err => {
//  console.error('Error al obtener citas', err);
//    }
// });
//}

//verDetalle(cita: Cita): void {
// this.citaSeleccionada = cita;
//}

//regresar(): void {
//   this.citaSeleccionada = null;
//  }
