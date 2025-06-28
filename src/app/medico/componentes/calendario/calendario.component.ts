import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {
  fechaActual = new Date();
  hoy = this.fechaActual.getDate();
  hoyMes = this.fechaActual.getMonth();
  hoyAnio = this.fechaActual.getFullYear();

  mesSeleccionado = this.hoyMes;
  anioSeleccionado = this.hoyAnio;
  diasEnCalendario: number[] = [];
  diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'];
  mostrarSelector = false;

  citas: any[] = [];
  citasDelDia: any[] = [];
  diaSeleccionado: number | null = null;
  diaSeleccionadoConCitas = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser')!);
    let idGuardado = user?.idUsuario;

    this.http.get<any[]>(`http://localhost:8080/api/medicos/cita/${idGuardado}`).subscribe({
      next: (data) => {
        this.citas = data;
        this.recargarCalendario();
      },
      error: (err) => {
        console.error('Error al cargar citas:', err);
      }
    });
  }

  recargarCalendario() {
    this.generarCalendario();
    this.diaSeleccionadoConCitas = false;
  }

  generarCalendario() {
    const primerDia = new Date(this.anioSeleccionado, this.mesSeleccionado, 1).getDay();
    const totalDias = new Date(this.anioSeleccionado, this.mesSeleccionado + 1, 0).getDate();
    this.diasEnCalendario = Array(primerDia).fill(0).concat(
      Array.from({ length: totalDias }, (_, i) => i + 1)
    );
  }

  formatearFecha(dia: number): string {
    const d = dia < 10 ? `0${dia}` : `${dia}`;
    const m = this.mesSeleccionado + 1 < 10 ? `0${this.mesSeleccionado + 1}` : `${this.mesSeleccionado + 1}`;
    return `${this.anioSeleccionado}-${m}-${d}`;
  }

  tieneCitas(dia: number): boolean {
    if (dia < 1) return false;
    const fecha = this.formatearFecha(dia);
    return this.citas.some(c => c.fecha === fecha);
  }

  seleccionarDia(dia: number) {
    if (dia < 1) return;
    this.diaSeleccionado = dia;
    const fecha = this.formatearFecha(dia);
    this.citasDelDia = this.citas.filter(c => c.fecha === fecha);
    this.diaSeleccionadoConCitas = this.citasDelDia.length > 0;
  }

  clearSeleccion() {
    this.diaSeleccionado = null;
    this.diaSeleccionadoConCitas = false;
  }

  mesAnterior() {
    if (this.mesSeleccionado === 0) {
      this.mesSeleccionado = 11;
      this.anioSeleccionado--;
    } else {
      this.mesSeleccionado--;
    }
    this.recargarCalendario();
  }

  mesSiguiente() {
    if (this.mesSeleccionado === 11) {
      this.mesSeleccionado = 0;
      this.anioSeleccionado++;
    } else {
      this.mesSeleccionado++;
    }
    this.recargarCalendario();
  }

  obtenerNombreMes(m: number) {
    return this.meses[m];
  }
}
