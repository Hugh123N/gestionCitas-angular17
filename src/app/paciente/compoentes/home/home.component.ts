import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../../service/service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CitaService } from '../../../service/cita.service';
import { ActivatedRoute, Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule,
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    FlexLayoutModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  nombrePaciente = 'Juan Pérez'; // Simulado, puedes sacarlo del token

  displayedColumns: string[] = ['medico', 'fecha', 'hora', 'estado', 'accion'];

  constructor(private service: ServiceService, private citaService: CitaService, private router: Router, private route: ActivatedRoute) { }

  citas = [
    {
      id: 1,
      medico: 'Dra. Ana López',
      fecha: new Date('2025-06-05'),
      hora: '10:30',
      estado: 'Confirmada'
    },
    {
      id: 2,
      medico: 'Dr. Jorge Ruiz',
      fecha: new Date('2025-06-10'),
      hora: '15:00',
      estado: 'Pendiente'
    }
  ];

  estadoClass(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'confirmada':
        return 'estado-confirmada';
      case 'pendiente':
        return 'estado-pendiente';
      case 'cancelada':
        return 'estado-cancelada';
      default:
        return '';
    }
  }

}
