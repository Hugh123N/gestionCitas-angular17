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

  agendarCita(cita: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/citas/agendar`, cita);
  }

  getMedicos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/medicos`);
  }

  cancelarCita(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/citas/cancelar/${id}`, {});
  }


   // ======================== MÉDICOS ========================

  


}
