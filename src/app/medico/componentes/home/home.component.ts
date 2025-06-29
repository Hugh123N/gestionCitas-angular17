import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CitaDTO } from '../../../interfaces/CitaDTO';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatTableModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  citaSeleccionada: CitaDTO | null = null;
  citas: CitaDTO[] = [];
  modoEdicion = false;
  mostrarConfirmacion = false;
  modoConfirmarCancelacion = false;
  tratamientoEditado = '';
  notasEditadas = '';
  fechaEditada = '';
  horaEditada = '';
  duracionEditada: number = 0;
  medicoEditado = '';
  pacienteEditado = '';
  estadoEditado = '';
  diagnosticoEditado = '';
  //aqi diagnosticoEditado = '';

  citaEnConfirmacion: CitaDTO | null = null;
  idMedico: number = 0;



  citasFiltradas: CitaDTO[] = [];
  filtroPendientesActivo = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.obtenerCitas();
  }

  obtenerCitas(): void {
    const user = JSON.parse(localStorage.getItem('currentUser')!);
    this.idMedico = user.idUsuario;

    this.http.get<any>(`http://localhost:8080/api/medicos/cita/${this.idMedico}`)
      .subscribe({
        next: (data) => {
          this.citas = data;
          this.citasFiltradas = [...this.citas];

        },
        error: (err) => {
          console.error('Error al obtener citas:', err);
        }
      });
  }
  filtrarPendientes(): void {
    this.citasFiltradas = this.citas.filter(c => c.estado === 'Pendiente');
    this.filtroPendientesActivo = true;
  }

  quitarFiltro(): void {
    this.citasFiltradas = [...this.citas];
    this.filtroPendientesActivo = false;
  }

  verDetalle(cita: CitaDTO): void {
    this.citaSeleccionada = cita;
    this.tratamientoEditado = cita.tratamiento;
    this.notasEditadas = cita.notasMedicas;
    this.fechaEditada = cita.fecha;
    this.horaEditada = cita.hora;
    this.diagnosticoEditado = cita.diagnostico;
    this.medicoEditado = cita.medico.nombre;
    this.pacienteEditado = cita.paciente.nombre;
    this.estadoEditado = cita.estado;
    this.modoEdicion = false;
    this.mostrarConfirmacion = false;
    this.modoConfirmarCancelacion = false;
  }

  regresar(): void {
    this.citaSeleccionada = null;
    this.modoEdicion = false;
    this.mostrarConfirmacion = false;
    this.modoConfirmarCancelacion = false;
  }

  activarEdicion(): void {
    this.modoEdicion = true;
  }

  confirmarEdicion(): void {
    this.mostrarConfirmacion = true;
    this.citaEnConfirmacion = this.citaSeleccionada;
  }

  ejecutarEdicion(): void {
    if (!this.citaEnConfirmacion) return;

    const body = {
      id: this.citaEnConfirmacion.idCitas,
      actionCitaMedicoDTO: {
        notasMedicas: this.notasEditadas,
        diagnostico: this.diagnosticoEditado,
        hora: this.horaEditada,
        fecha: this.fechaEditada,
        tratamiento: this.tratamientoEditado

      }
    };

    this.http.put<any>('http://localhost:8080/api/cita/actualizar/info-cita', body)
      .subscribe({
        next: (res) => {
          console.log(res.message);
          // Actualiza solo los campos modificados
          if (this.citaSeleccionada) {
            this.citaSeleccionada.notasMedicas = this.notasEditadas;
            this.citaSeleccionada.diagnostico = this.diagnosticoEditado;
            this.citaSeleccionada.fecha = this.fechaEditada;
            this.citaSeleccionada.hora = this.horaEditada;
            this.citaSeleccionada.tratamiento = this.tratamientoEditado;

          }
          this.obtenerCitas(); // para actualizar la lista general
          this.resetearEstados();
        },
        error: (err) => {
          console.error('Error al editar cita:', err);
        }
      });
  }
  //*********************************************** */

  cancelarEdicion(): void {
    this.resetearEstados();
  }

  cancelarCita(): void {
    this.modoConfirmarCancelacion = true;
    this.citaEnConfirmacion = this.citaSeleccionada;
  }

  ejecutarCancelacion(): void {
    if (!this.citaEnConfirmacion) return;



    this.http.put<any>(`http://localhost:8080/api/cita/actualizarEstado/${this.citaEnConfirmacion.idCitas}`, {})
      .subscribe({
        next: () => {
          if (this.citaSeleccionada) {
            this.citaSeleccionada.estado = 'Cancelada'; // o el estado real devuelto si tu backend lo manda
          }
          this.obtenerCitas();
          this.resetearEstados();
        },
        error: (err) => {
          console.error('Error al cancelar cita:', err);
        }
      });
  }


  cancelarCancelacion(): void {
    this.resetearEstados();
  }

  private resetearEstados(): void {
    this.mostrarConfirmacion = false;
    this.modoEdicion = false;
    this.modoConfirmarCancelacion = false;
    this.citaEnConfirmacion = null;
  }
}






