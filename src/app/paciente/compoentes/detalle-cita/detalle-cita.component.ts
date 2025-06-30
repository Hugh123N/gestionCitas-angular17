import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { ServiceService } from '../../../service/service.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-detalle-cita',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './detalle-cita.component.html',
  styleUrl: './detalle-cita.component.css'
})
export class DetalleCitaComponent implements OnInit {
  cita: any;
  idCita: number = 0;
  loading: boolean = true;
  error: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private service: ServiceService) { }

  ngOnInit() {
    this.idCita = Number(this.route.snapshot.paramMap.get('id'));
    this.obtenerCita(this.idCita);
  }

  obtenerCita(id: number) {
    this.service.getCitaById(id).subscribe({
      next: (data) => {
        this.cita = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener la cita', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  getEstadoColor(estado: string): 'primary' | 'accent' | 'warn' {
    switch (estado.toLowerCase()) {
      case 'pendiente': return 'accent';
      case 'confirmada': return 'primary';
      case 'cancelada': return 'warn';
      default: return 'primary';
    }
  }

  descargarReceta() {
    const recetaId = this.cita.recetaDTO.idReceta;

    this.service.getDownloadPdfReceta(recetaId).subscribe({
      next: (pdfBlob) => {
        const blob = new Blob([pdfBlob], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `receta-${recetaId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al descargar la receta:', err);
      }
    });
  }

  volverInicio() {
    this.router.navigate(['/paciente']);
  }
}
