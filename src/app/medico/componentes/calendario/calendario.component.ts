import { Component, OnInit } from '@angular/core';
import { ResponseCalendario } from '../../../interfaces/ResponseCalendario';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [FormsModule, CommonModule, MatCardModule, MatTableModule],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css'
})
export class CalendarioComponent implements OnInit {


  fechaActual = new Date();
  mesSeleccionado: number = this.fechaActual.getMonth();
  anioSeleccionado: number = this.fechaActual.getFullYear();
  diasEnCalendario: number[] = [];
  diasSemana: string[] = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  meses: string[] = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'];
  mostrarSelector: boolean = false;

  tooltipVisible = false;
  tooltipX = 0;
  tooltipY = 0;
  tooltipDia: number = 0;
  citasDelDia: any[] = [];

  citas = [
    {
      nombre: 'María Rodríguez',
      horario: '10:00 a. m.',
      fecha: '2025-05-14',
      duracion: '30 minutos',
      estado: 'Finalizada'
    },
    {
      nombre: 'Juan Gonzales',
      horario: '09:00 a. m.',
      fecha: '2025-05-18',
      duracion: '45 minutos',
      estado: 'Pendiente'
    }
  ];

  ngOnInit() {
    this.generarCalendario();
  }

  generarCalendario() {
    const primerDia = new Date(this.anioSeleccionado, this.mesSeleccionado, 1).getDay();
    const totalDias = new Date(this.anioSeleccionado, this.mesSeleccionado + 1, 0).getDate();

    this.diasEnCalendario = [];

    // Espacios vacíos al inicio del mes
    for (let i = 0; i < primerDia; i++) {
      this.diasEnCalendario.push(0);
    }

    for (let d = 1; d <= totalDias; d++) {
      this.diasEnCalendario.push(d);
    }
  }

  mesAnterior() {
    if (this.mesSeleccionado === 0) {
      this.mesSeleccionado = 11;
      this.anioSeleccionado--;
    } else {
      this.mesSeleccionado--;
    }
    this.generarCalendario();
  }

  mesSiguiente() {
    if (this.mesSeleccionado === 11) {
      this.mesSeleccionado = 0;
      this.anioSeleccionado++;
    } else {
      this.mesSeleccionado++;
    }
    this.generarCalendario();
  }

  obtenerNombreMes(mes: number): string {
    return this.meses[mes];
  }

  esDiaDelMesActual(dia: number): boolean {
    return dia > 0;
  }

  tieneCitas(dia: number): boolean {
    const diaStr = dia < 10 ? `0${dia}` : `${dia}`;
    const mesStr = this.mesSeleccionado + 1 < 10 ? `0${this.mesSeleccionado + 1}` : `${this.mesSeleccionado + 1}`;
    const fecha = `${this.anioSeleccionado}-${mesStr}-${diaStr}`;
    return this.citas.some(cita => cita.fecha === fecha);
  }

  mostrarTooltip(dia: number, event: MouseEvent) {
    if (!this.esDiaDelMesActual(dia)) return;

    const diaStr = dia < 10 ? `0${dia}` : `${dia}`;
    const mesStr = this.mesSeleccionado + 1 < 10 ? `0${this.mesSeleccionado + 1}` : `${this.mesSeleccionado + 1}`;
    const fecha = `${this.anioSeleccionado}-${mesStr}-${diaStr}`;

    this.tooltipDia = dia;
    this.citasDelDia = this.citas.filter(c => c.fecha === fecha);

    if (this.citasDelDia.length > 0) {
      this.tooltipVisible = true;
      this.tooltipX = event.clientX + 10;
      this.tooltipY = event.clientY + 10;
    }
  }

  ocultarTooltip() {
    this.tooltipVisible = false;
  }


}
