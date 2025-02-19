import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../service/service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './mis-citas.component.html',
  styleUrl: './mis-citas.component.css'
})
export class MisCitasComponent implements OnInit{

  citas: any[] = [];
  pacienteId: number | null = null;

  constructor(private route: ActivatedRoute, private service: ServiceService, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.pacienteId = params['pacienteId'];
      if (this.pacienteId) {
        this.obtenerCitas(this.pacienteId);
      }
    });
  }

  obtenerCitas(id: number) {
    this.service.getCitasPorPaciente(id).subscribe(
      (data: any) => {
        this.citas = data;
      },
      error => {
        console.error('Error al obtener citas', error);
      }
    );
  }

  volver(){
    this.router.navigate(['/home']);
  }

}
