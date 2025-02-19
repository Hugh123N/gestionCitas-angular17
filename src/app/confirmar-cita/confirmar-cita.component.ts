import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../service/service.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-confirmar-cita',
  standalone: true,
  imports: [],
  templateUrl: './confirmar-cita.component.html',
  styleUrl: './confirmar-cita.component.css'
})
export class ConfirmarCitaComponent implements OnInit{
  especialidad: string = '';
  doctor: string = '';
  idDoctor: number | null = null;
  fecha: string = '';
  hora: string = '';
  pacienteId: number | null = null;
  //almacenamos datos de paciente
  paciente: any = {};

  constructor(private route: ActivatedRoute,
    private router:Router, private service: ServiceService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.especialidad = params['especialidad'];
      this.doctor = params['doctor'];
      this.idDoctor = params['idDoctor'];
      this.fecha = params['fecha'];
      this.hora = params['hora'];
      this.pacienteId = params['pacienteId'];

      // Llamamos al servicio para obtener los datos del paciente
      if (this.pacienteId) {
        this.service.getPacienteById(this.pacienteId).subscribe({
          next: (data) => {
            this.paciente = data; // Almacenamos los datos del paciente
          },
          error: (err) => {
            console.error('Error al obtener los datos del paciente', err);
          }
        });
      }
    });
  }

  // Función que maneja el click en el botón "Confirmar"
  confirmarCita() {
    // Creamos el objeto de cita para enviar
    const cita = {
      pacienteId: this.pacienteId,
      medicoId: this.idDoctor,
      fecha: this.fecha,
      hora: this.hora
    };

    // Llamamos al servicio para agendar la cita
    this.service.agendarCita(cita).subscribe({
      next: (response) => {
        alert('Cita agendada exitosamente!');
        this.router.navigate(['/mis-citas'], {
          queryParams: { pacienteId: this.pacienteId }
        });
      },
      error: (err) => {
        console.error('Error al agendar la cita', err);
        alert('Ocurrió un error al agendar la cita');
      }
    });
  }

  volver(){
    this.router.navigate(['/agenda-fecha']);
  }
}
