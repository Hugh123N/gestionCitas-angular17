import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { RecetaDTO } from '../../../interfaces/RecetaDTO';
import { CitaDTO } from '../../../interfaces/CitaDTO';
import { FiltroPorNombrePipe } from './filtro-por-nombre.pipe';
import { MedicamentoDTO } from '../../../interfaces/MedicamentoDTO';

@Component({
  selector: 'app-recetas',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatTableModule, FiltroPorNombrePipe],
  templateUrl: './recetas.component.html',
  styleUrls: ['./recetas.component.css'],
})
export class RecetasComponent implements OnInit {
  citas: CitaDTO[] = [];
  recetas: RecetaDTO[] = [];
  medicamentos: MedicamentoDTO[] = [];
  medicamentosDeReceta: MedicamentoDTO[] = [];

  recetaSeleccionada: RecetaDTO | null = null;
  citaSeleccionada: CitaDTO | null = null;

  mostrarFormulario = false;
  mostrarVistaReceta = false;
  mostrarConfirmacion = false;
  mostrarConfirmacionEliminar = false;

  filtroNombre: string = '';
  instruccionesAdicionales = '';
  firmaMedico = '';
  fechaReceta = '';

  // Nuevos estados para medicamentos
  mostrarFormularioMedicamento = false;
  mostrarConfirmacionMedicamento = false;
  nuevoMedicamento: MedicamentoDTO = {
    nombre_medicamento: '',
    dosis: '',
    frecuencia: '',
    duracion: '',
    observaciones: '',
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.obtenerCitas();
    this.obtenerRecetas();
    this.obtenerMedicamentos();
  }

  obtenerCitas(): void {
    this.http.get<any>('http://localhost:8089/api/citas').subscribe(res => {
      this.citas = res.citas;
    });
  }

  obtenerRecetas(): void {
    this.http.get<any>('http://localhost:8089/api/receta').subscribe(res => {
      this.recetas = res.recetas;
    });
  }

  obtenerMedicamentos(): void {
    this.http.get<any>('http://localhost:8089/api/medicamento').subscribe(res => {
      this.medicamentos = res.medicamentos;
    });
  }

  tieneReceta(idCita: number): boolean {
    return this.recetas.some(r => r.cita.id === idCita);
  }

  verReceta(idCita: number): void {
    this.recetaSeleccionada = this.recetas.find(r => r.cita.id === idCita) || null;
    this.mostrarVistaReceta = true;
    this.mostrarFormulario = false;
    this.mostrarFormularioMedicamento = false;
    this.mostrarConfirmacionMedicamento = false;

    if (this.recetaSeleccionada) {
      const idReceta = this.recetaSeleccionada.id_receta;
      this.medicamentosDeReceta = this.medicamentos.filter(m => m.receta.id_receta === idReceta);
    }
  }

  abrirFormulario(cita: CitaDTO): void {
    this.citaSeleccionada = cita;
    this.mostrarFormulario = true;
    this.mostrarVistaReceta = false;
    this.instruccionesAdicionales = '';
    this.firmaMedico = '';
    this.fechaReceta = '';
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.mostrarConfirmacion = false;
  }

  confirmarFormulario(): void {
    this.mostrarConfirmacion = true;
  }

  guardarReceta(): void {
    if (!this.citaSeleccionada) return;

    const receta = {
      instrucciones_adicionales: this.instruccionesAdicionales,
      firma_medico: this.firmaMedico,
      fecha: this.fechaReceta,
    };

    this.http.post(`http://localhost:8089/api/receta/${this.citaSeleccionada.id}`, receta).subscribe({
      next: () => {
        this.obtenerRecetas();
        this.cancelarFormulario();
      },
      error: err => console.error('Error al guardar receta:', err),
    });
  }

  cerrarVistaReceta(): void {
    this.mostrarVistaReceta = false;
    this.recetaSeleccionada = null;
    this.medicamentosDeReceta = [];
  }

  abrirConfirmacionEliminar(): void {
    this.mostrarConfirmacionEliminar = true;
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacionEliminar = false;
  }

  confirmarEliminar(): void {
    if (!this.recetaSeleccionada) return;
    const idReceta = this.recetaSeleccionada.id_receta;

    this.http.delete(`http://localhost:8089/api/receta/${idReceta}`).subscribe({
      next: () => {
        this.obtenerRecetas();
        this.cerrarVistaReceta();
        this.mostrarConfirmacionEliminar = false;
        alert('Receta eliminada exitosamente');
      },
      error: err => {
        console.error('Error al eliminar receta:', err);
        alert('Error al intentar eliminar la receta');
      },
    });
  }

  // NUEVO: Abrir formulario de medicamento
  abrirFormularioMedicamento(): void {
    this.mostrarFormularioMedicamento = true;
    this.mostrarConfirmacionMedicamento = false;
    this.nuevoMedicamento = {
      nombre_medicamento: '',
      dosis: '',
      frecuencia: '',
      duracion: '',
      observaciones: '',
    };
  }

  cancelarFormularioMedicamento(): void {
    this.mostrarFormularioMedicamento = false;
    this.mostrarConfirmacionMedicamento = false;
  }

  confirmarAgregarMedicamento(): void {
    this.mostrarConfirmacionMedicamento = true;
  }

  guardarMedicamento(): void {
    if (!this.recetaSeleccionada) return;

    this.http
      .post(`http://localhost:8089/api/medicamento/${this.recetaSeleccionada.id_receta}`, this.nuevoMedicamento)
      .subscribe({
        next: () => {
          this.obtenerMedicamentos();
          this.verReceta(this.recetaSeleccionada!.cita.id); // Refrescar receta actual
          this.cancelarFormularioMedicamento();
          alert('Medicamento registrado correctamente');
        },
        error: err => {
          console.error('Error al guardar medicamento:', err);
          alert('Error al registrar el medicamento');
        },
      });
  }
}
