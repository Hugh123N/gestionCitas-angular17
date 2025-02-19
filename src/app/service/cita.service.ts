import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  private especialidad: { id: number, nombre: string } | null = null;
  private medico: { id: number, nombre: string } | null = null;
  private fecha: string | null = null;
  private hora: string | null = null;
  private pacienteId: number | null = null;

  constructor() { }

  setEspecialidad(id: number, nombre: string) {
    this.especialidad = { id, nombre };
  }

  getEspecialidad() {
    return this.especialidad;
  }

  setMedico(id: number, nombre: string) {
    this.medico = { id, nombre };
  }

  getMedico() {
    return this.medico;
  }

  setFechaHora(fecha: string, hora: string) {
    this.fecha = fecha;
    this.hora = hora;
  }

  getFechaHora() {
    return { fecha: this.fecha, hora: this.hora };
  }
}
