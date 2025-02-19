import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private apiUrl = 'http://localhost:8080'; // URL base de la API

  constructor(private http: HttpClient) { }

  // ======================== USUARIO ========================
  // Registrar usuario
  registerUser(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuario/save`, usuario);
  }

  // Iniciar sesión
  loginUser(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuario/login`, usuario);
  }

  // ======================== ESPECIALIDADES ========================
  // Obtener todas las especialidades
  getEspecialidades(): Observable<any> {
    return this.http.get(`${this.apiUrl}/especialidades/all`);
  }

  // ======================== MÉDICOS ========================
  // Obtener médicos por especialidad
  getMedicosByEspecialidad(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/medicos/especialidad/${id}`);
  }

  // ======================== PACIENTES ========================
  // Obtener todos los pacientes
  getAllPacientes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/paciente/all`);
  }

  // Obtener paciente por ID
  getPacienteById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/paciente/${id}`);
  }

  // ======================== CITAS MÉDICAS ========================
  // Agendar una cita
  agendarCita(cita: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/citas/agendar`, cita);
  }

  // Obtener citas por paciente
  getCitasPorPaciente(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/citas/paciente/${id}`);
  }

  // Cancelar una cita
  cancelarCita(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/citas/cancelar/${id}`, {});
  }
}
