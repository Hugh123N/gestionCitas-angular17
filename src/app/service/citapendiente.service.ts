import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { Observable } from 'rxjs';
import { ResponseCitaMedica } from '../interfaces/ResponseCitaMedica';

@Injectable({
  providedIn: 'root'
})
export class CitaPendienteService {



  private http = inject(HttpClient);
  private baseUrl: string = appsettings.apiUrl

  constructor() { }


  lista(): Observable<ResponseCitaMedica> {
    return this.http.get<ResponseCitaMedica>(`${this.baseUrl}citaMedica/Lista`)
  }

}
