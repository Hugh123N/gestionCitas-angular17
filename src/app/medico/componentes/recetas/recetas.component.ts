import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CitaDTO } from '../../../interfaces/CitaDTO';
import { RecetaDTO } from '../../../interfaces/RecetaDTO';
import { MedicamentoDTO } from '../../../interfaces/MedicamentoDTO';
import { FiltroPorNombrePipe } from './filtro-por-nombre.pipe';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recetas',
  standalone: true,
  imports: [CommonModule, FormsModule, FiltroPorNombrePipe],
  templateUrl: './recetas.component.html',
  styleUrls: ['./recetas.component.css']
})
export class RecetasComponent implements OnInit {
  citas: CitaDTO[] = [];
  medicamentosDeReceta: MedicamentoDTO[] = [];
  recetaSeleccionada: RecetaDTO | null = null;
  citaSeleccionada: CitaDTO | null = null;

  filtroNombre: string = '';
  fechaReceta: string = '';
  firmaMedico: string = '';
  instruccionesAdicionales: string = '';

  mostrarFormulario = false;
  mostrarConfirmacion = false;
  mostrarVistaReceta = false;
  mostrarConfirmacionEliminar = false;

  mostrarFormularioMedicamento = false;
  mostrarConfirmacionMedicamento = false;

  nuevoMedicamento: MedicamentoDTO = {
    medicamento: '',
    dosis: '',
    frecuencia: '',
    duracion: '',
    observaciones: ''
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // SOLO para pruebas: simula un médico si no está en localStorage
    const userEnStorage = localStorage.getItem('user');
    if (!userEnStorage) {
      const medicoDummy = {
        idUsuario: 6,
        nombre: 'fernando',
        apellido: 'colunga',
        rol: 'Medico'
      };
      localStorage.setItem('user', JSON.stringify(medicoDummy));
    }

    const user = JSON.parse(localStorage.getItem('user')!);
    const medicoId = user?.idUsuario;

    if (!medicoId) {
      console.error('No se encontró el id del médico');
      return;
    }

    this.http.get<CitaDTO[]>(`http://localhost:8080/api/medicos/cita/${medicoId}`).subscribe({
      next: data => {
        this.citas = data;
      },
      error: err => {
        console.error('Error al obtener citas:', err);
      }
    });
  }

  abrirFormulario(cita: CitaDTO) {
    this.citaSeleccionada = cita;
    this.mostrarFormulario = true;
  }

  cancelarFormulario() {
    this.mostrarFormulario = false;
    this.mostrarConfirmacion = false;
  }

  confirmarFormulario() {
    this.mostrarConfirmacion = true;
  }

  guardarReceta() {
    const body = {
      idCita: this.citaSeleccionada!.idCitas,
      instruccionesAdicionales: this.instruccionesAdicionales,
      firmaMedico: this.firmaMedico,
      fecha: this.fechaReceta
    };

    this.http.post('http://localhost:8080/api/cita/registrarReceta', body).subscribe(() => {
      window.location.reload();
    });
  }

  verReceta(cita: CitaDTO) {
    const pacienteId = cita.paciente.idUsuario;
    this.http.get<RecetaDTO[]>(`http://localhost:8080/api/recetas/paciente/${pacienteId}`).subscribe(data => {
      const receta = data.find(r => r.tratamiento === cita.tratamiento);
      if (receta) {
        this.recetaSeleccionada = receta;
        this.mostrarVistaReceta = true;

        this.http.get<any>(`http://localhost:8080/api/medicamentos/listar-por-receta/${receta.idReceta}`)
          .subscribe(res => this.medicamentosDeReceta = res.medicamentos);
      }
    });
  }

  cerrarVistaReceta() {
    this.mostrarVistaReceta = false;
    this.recetaSeleccionada = null;
    this.medicamentosDeReceta = [];
  }

  abrirFormularioMedicamento() {
    this.mostrarFormularioMedicamento = true;
  }

  cancelarFormularioMedicamento() {
    this.mostrarFormularioMedicamento = false;
    this.mostrarConfirmacionMedicamento = false;
  }

  confirmarAgregarMedicamento() {
    this.mostrarConfirmacionMedicamento = true;
  }

  guardarMedicamento() {
    const body = {
      idReceta: this.recetaSeleccionada!.idReceta,
      ...this.nuevoMedicamento
    };

    this.http.post('http://localhost:8080/api/medicamentos/registrar', body).subscribe(() => {
      this.verReceta(this.citaSeleccionada!);
      this.cancelarFormularioMedicamento();
    });
  }

  eliminarMedicamento(id: number) {
    this.http.delete(`http://localhost:8080/api/medicamentos/eliminar/${id}`).subscribe(() => {
      this.recetaSeleccionada && this.verReceta(this.citaSeleccionada!);
    });
  }

  abrirConfirmacionEliminar() {
    this.mostrarConfirmacionEliminar = true;
  }

  cancelarEliminar() {
    this.mostrarConfirmacionEliminar = false;
  }

  confirmarEliminar() {
    this.http.delete(`http://localhost:8080/api/recetas/${this.recetaSeleccionada!.idReceta}`).subscribe(() => {
      this.cerrarVistaReceta();
    });
  }
}
