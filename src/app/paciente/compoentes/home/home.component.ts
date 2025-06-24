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
import { AuthService } from '../../../service/auth.service';
import { Subscription } from 'rxjs';

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


  role: string | null = null;
  userName = '';
  userId: number | null = null;

  citas: any[] = [];
  displayedColumns: string[] = ['medico', 'fecha', 'hora', 'estado', 'accion'];

  constructor(private service: ServiceService, private citaService: CitaService, private router: Router, private route: ActivatedRoute, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.role = user.role;
      this.userName = user.userName;
      this.userId = user.idUsuario;

      if (this.role === 'Paciente' && this.userId) {
        this.cargarCitas(this.userId);
      }
    });


  }

  cargarCitas(id: number) {
    this.service.getCitasPorPaciente(id).subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.citas = res.map((c: any) => ({
            id: c.idCitas,
            medico: `Dr(a). ${c.medico.nombre} ${c.medico.apellido}`,
            fecha: c.fecha,
            hora: c.hora,
            estado: c.estado
          }));
        } else {
          this.citas = [];
          console.warn('Mensaje del backend:', res.message);
        }
      },
      error: (err) => {
        console.error('Error al obtener citas:', err);
      }
    });
  }

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
