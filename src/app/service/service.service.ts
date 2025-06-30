import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  // ======================== PACIENTES ========================

  registrarPaciente(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/pacientes/registrar`, usuario);
  }

  getCitasPorPaciente(idPaciente: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/pacientes/cita/${idPaciente}`);
  }

  registrarCita(cita: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/cita/registrar`, cita);
  }

  getMedicos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/medicos`);
  }

  disponibilidad(id: number,): Observable<any> {
    return this.http.put(`${this.apiUrl}/citas/cancelar/${id}`, {});
  }

  getCitaById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/cita/id/${id}`);
  }

  getHorariosDisponibles(idMedico: number, fecha: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/medicos/${idMedico}?fecha=${fecha}`);
  }

  getDownloadPdfReceta(idMedico: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/api/recetas/pdf/${idMedico}`,{
      responseType: 'blob'
    });
  }
  
  // ======================== MÉDICOS ========================




}
