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


  //--------------------------------------------------------------
  ngOnInit(): void {
    this.cargarCitas();
  }


  cargarCitas(): void {
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
  //--------------------------------------------------------------

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
      this.mostrarFormulario = false;
      this.mostrarConfirmacion = false;
      this.citaSeleccionada = null;

      // Esperar un poco a que el backend actualice la cita con la receta
      setTimeout(() => {
        this.cargarCitas(); // 🔁 Vuelve a cargar la lista de citas
      }, 300);
    });
  }

  verReceta(cita: CitaDTO) {
    if (!cita.recetaDTO) {
      console.warn('Esta cita no tiene receta registrada');
      return;
    }

    this.recetaSeleccionada = {
      ...cita.recetaDTO,
      nombrePaciente: `${cita.paciente.nombre} ${cita.paciente.apellido}`,
      grupoSanguineoPaciente: cita.paciente.grupoSanguineo,
      nombreMedico: `${cita.medico.nombre} ${cita.medico.apellido}`,
      especialidadMedico: cita.medico.especialidad,
      diagnostico: cita.diagnostico,
      tratamiento: cita.tratamiento,
      instrucciones: (cita.recetaDTO as any).instruccionesAdicionales,
      medicamentos: [] // lo cargaremos luego
    };

    this.mostrarVistaReceta = true;
    this.mostrarFormularioMedicamento = false;
    this.mostrarConfirmacionMedicamento = false;

    this.http.get<any>(`http://localhost:8080/api/medicamentos/listar-por-receta/${this.recetaSeleccionada.idReceta}`)
      .subscribe({
        next: res => this.medicamentosDeReceta = res.medicamentos || [],
        error: err => {
          console.error('Error al obtener medicamentos:', err);
          this.medicamentosDeReceta = [];
        }
      });
  }






  cerrarVistaReceta() {
    this.mostrarVistaReceta = false;
    this.recetaSeleccionada = null;
    this.medicamentosDeReceta = [];
    this.mostrarConfirmacionEliminar = false; // <- por si quedó abierta
  }

  abrirFormularioMedicamento() {
    // 🔁 Reset del medicamento nuevo
    this.nuevoMedicamento = {
      medicamento: '',
      dosis: '',
      frecuencia: '',
      duracion: '',
      observaciones: ''
    };

    this.mostrarFormularioMedicamento = true;
    this.mostrarConfirmacionMedicamento = false;
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
      // Espera un momento y vuelve a cargar los medicamentos actualizados
      setTimeout(() => {
        this.http.get<any>(`http://localhost:8080/api/medicamentos/listar-por-receta/${this.recetaSeleccionada!.idReceta}`)
          .subscribe(res => this.medicamentosDeReceta = res.medicamentos);
      }, 300); // 300ms para asegurarse que el backend guardó

      this.cancelarFormularioMedicamento();
    });
  }

  eliminarMedicamento(id: number) {
    this.http.delete(`http://localhost:8080/api/medicamentos/eliminar/${id}`).subscribe(() => {
      // Vuelve a cargar SOLO los medicamentos
      this.http.get<any>(`http://localhost:8080/api/medicamentos/listar-por-receta/${this.recetaSeleccionada!.idReceta}`)
        .subscribe(res => this.medicamentosDeReceta = res.medicamentos);
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
      this.cerrarVistaReceta();           // Cierra panel de receta
      this.mostrarConfirmacionEliminar = false; // 🔁 Cierra el panel de confirmación
      this.cargarCitas();                 // Recarga citas para reflejar cambios
    });
  }


}
