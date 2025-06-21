import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { RecetaDTO } from '../../../interfaces/RecetaDTO';
import { CitaDTO } from '../../../interfaces/CitaDTO';
import { FiltroPorNombrePipe } from './filtro-por-nombre.pipe';

@Component({
  selector: 'app-recetas',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatTableModule, FiltroPorNombrePipe],
  templateUrl: './recetas.component.html',
  styleUrls: ['./recetas.component.css'], // ← DEBE ESTAR AQUÍ


})
export class RecetasComponent implements OnInit {
  citas: CitaDTO[] = [];
  recetas: RecetaDTO[] = [];
  recetaSeleccionada: RecetaDTO | null = null;
  citaSeleccionada: CitaDTO | null = null;
  mostrarFormulario = false;
  mostrarVistaReceta = false;
  mostrarConfirmacion = false;
  mostrarConfirmacionEliminar = false;


  instruccionesAdicionales = '';
  firmaMedico = '';
  fechaReceta = '';
  filtroNombre: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.obtenerCitas();
    this.obtenerRecetas();
  }

  obtenerCitas(): void {
    this.http.get<any>('http://localhost:8089/api/citas')
      .subscribe(res => {
        this.citas = res.citas;
      });
  }

  obtenerRecetas(): void {
    this.http.get<any>('http://localhost:8089/api/receta')
      .subscribe(res => {
        this.recetas = res.recetas;
      });
  }

  tieneReceta(idCita: number): boolean {
    return this.recetas.some(r => r.cita.id === idCita);
  }

  verReceta(idCita: number): void {
    this.recetaSeleccionada = this.recetas.find(r => r.cita.id === idCita) || null;
    this.mostrarVistaReceta = true;
    this.mostrarFormulario = false;
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
      fecha: this.fechaReceta
    };

    this.http.post(`http://localhost:8089/api/receta/${this.citaSeleccionada.id}`, receta)
      .subscribe({
        next: () => {
          this.obtenerRecetas();
          this.cancelarFormulario();
        },
        error: err => console.error('Error al guardar receta:', err)
      });
  }



  cerrarVistaReceta(): void {
    this.mostrarVistaReceta = false;
    this.recetaSeleccionada = null;
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

    this.http.delete(`http://localhost:8089/api/receta/${idReceta}`)
      .subscribe({
        next: () => {
          this.obtenerRecetas();
          this.cerrarVistaReceta();
          this.mostrarConfirmacionEliminar = false;
          alert('Receta eliminada exitosamente');
        },
        error: err => {
          console.error('Error al eliminar receta:', err);
          alert('Error al intentar eliminar la receta');
        }
      });
  }


}
