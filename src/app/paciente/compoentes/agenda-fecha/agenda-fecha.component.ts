import { Component } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-agenda-fecha',
  standalone: true,
  imports: [   MatDatepickerModule,
    MatNativeDateModule, FormsModule, CommonModule],
  templateUrl: './agenda-fecha.component.html',
  styleUrl: './agenda-fecha.component.css'
})
export class AgendaFechaComponent {
  diasSemana = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'];
  mesActual = new Date().getMonth();
  anioActual = new Date().getFullYear();
  fechaSeleccionada: string | null = null;
  horaSeleccionada: string | null = null;
  calendario: any[][] = [];
  horariosDisponibles: string[] = [];

  //datos de medico y especialidad de la anterior vista
  especialidad: string = '';
  doctor: string = '';
  idDoctor: number | null = null;
  pacienteId:string='';

  constructor(private router: Router, private route: ActivatedRoute) {
    this.generarCalendario();
    
    this.route.queryParams.subscribe(params => {
      this.especialidad = params['especialidad'];
      this.doctor = params['doctor'];
      this.idDoctor = params['idDoctor'];
      this.pacienteId=params['pacienteId'];
    });
  }

  // Helper para agregar un 0 delante si el número es menor que 10
  private formatearNumero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  obtenerNombreMes(mes: number): string {
    const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return nombresMeses[mes];
  }

  generarCalendario() {
    const primerDia = new Date(this.anioActual, this.mesActual, 1).getDay();
    const diasEnMes = new Date(this.anioActual, this.mesActual + 1, 0).getDate();
    let dia = 1;
    this.calendario = [];

    for (let i = 0; i < 6; i++) {
      const semana = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < primerDia) {
          semana.push(null);
        } else if (dia > diasEnMes) {
          semana.push(null);
        } else {
          const fecha = `${this.anioActual}-${this.formatearNumero(this.mesActual + 1)}-${this.formatearNumero(dia)}`;
          semana.push({
            numero: dia,
            fecha: fecha,
            esDomingo: j === 6 // Deshabilita los domingos
          });
          dia++;
        }
      }
      this.calendario.push(semana);
    }
  }

  cambiarMes(delta: number) {
    this.mesActual += delta;
    if (this.mesActual < 0) {
      this.mesActual = 11;
      this.anioActual--;
    } else if (this.mesActual > 11) {
      this.mesActual = 0;
      this.anioActual++;
    }
    this.generarCalendario();
  }

  seleccionarFecha(fecha: string | null) {
    if (!fecha) return;
    const diaSeleccionado = new Date(fecha).getDay();

    if (diaSeleccionado === 0) return; // No permite domingos

    this.fechaSeleccionada = fecha;
    this.generarHorarios(diaSeleccionado);
  }

  generarHorarios(diaSeleccionado: number) {
    if (diaSeleccionado === 6) {
      // Sábado: 7:00 AM - 12:00 PM
      this.horariosDisponibles = this.generarListaHorarios(7, 12);
    } else {
      // Lunes - Viernes: 7:00 AM - 7:00 PM
      this.horariosDisponibles = this.generarListaHorarios(7, 19);
    }
  }

  generarListaHorarios(inicio: number, fin: number): string[] {
    const horarios = [];
    for (let hora = inicio; hora <= fin; hora++) {
      horarios.push(`${this.formatearNumero(hora)}:00`);
      if (hora < 12) {
        horarios.push(`${this.formatearNumero(hora)}:30`);
      }
    }
    return horarios;
  }

  seleccionarHora(hora: string) {
    this.horaSeleccionada = hora;
  }

  irAConfirmarCita() {
    this.router.navigate(['/confirmar-cita'], {
      queryParams: {
        especialidad: this.especialidad,
        doctor: this.doctor,
        idDoctor: this.idDoctor,
        fecha: this.fechaSeleccionada,
        hora: this.horaSeleccionada,
        pacienteId: this.pacienteId // Aquí deberías reemplazarlo con el ID del paciente real
      }
    });
  }

  volver() {
    this.router.navigate(['/home']);
  }

}
