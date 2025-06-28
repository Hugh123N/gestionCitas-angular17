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
  citaEnConfirmacion: CitaDTO | null = null;



  citasFiltradas: CitaDTO[] = [];
  filtroPendientesActivo = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.obtenerCitas();
  }

  obtenerCitas(): void {
    this.http.get<any>('http://localhost:8089/api/citas')
      .subscribe({
        next: (data) => {
          this.citas = data.citas;
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

    const cuerpo = {
      ...this.citaEnConfirmacion,
      tratamiento: this.tratamientoEditado,
      fecha: this.fechaEditada,
      horario: this.horaEditada,
      duracion: this.duracionEditada,
      medico: this.medicoEditado,
      nombre: this.pacienteEditado,
      estado: this.estadoEditado,
      notas: this.notasEditadas
    };

    this.http.put<any>(`http://localhost:8089/api/citas/${cuerpo.idCitas}`, cuerpo)
      .subscribe({
        next: (res) => {
          this.obtenerCitas();
          // this.verDetalle(cuerpo);
          this.resetearEstados();
        },
        error: (err) => {
          console.error('Error al editar cita:', err);
        }
      });
  }


  cancelarEdicion(): void {
    this.resetearEstados();
  }

  cancelarCita(): void {
    this.modoConfirmarCancelacion = true;
    this.citaEnConfirmacion = this.citaSeleccionada;
  }

  ejecutarCancelacion(): void {
    if (!this.citaEnConfirmacion) return;

    this.http.put<any>(`http://localhost:8089/api/citas/eliminar/${this.citaEnConfirmacion.idCitas}`, {})
      .subscribe({
        next: () => {
          this.obtenerCitas();
          if (this.citaSeleccionada) {
            this.citaSeleccionada.estado = 'Finalizada';
          }
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






