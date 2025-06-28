import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { UserRole } from '../core/models/roles.enum';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

interface UserData {
  idUsuario: number,
  userName: string;
  role: UserRole;
  isLoggedIn: boolean;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = 'http://localhost:8080';
  private http = inject(HttpClient);
  private router = inject(Router);

  // BehaviorSubject para mantener el estado de autenticación del usuario
  private currentUserSubject: BehaviorSubject<UserData> =
    new BehaviorSubject<UserData>({
      idUsuario: 0,
      userName: "",
      role: UserRole.PACIENTE,
      isLoggedIn: false,
      token: ""
    });

  public currentUser$: Observable<UserData> = this.currentUserSubject.asObservable();

  constructor() {
    // Intentar cargar la información del usuario del localStorage al iniciar el servicio
    this.loadUserFromLocalStorage();
  }

  login(email: string, contrasenia: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, { email, contrasenia })
      .pipe(
        tap((response) => {
          console.log('LOGIN RESPONSE:', response);
          if (!response.usuario || !response.token) {
            throw new Error('Respuesta inválida del servidor');
          }

          const userData: UserData = {
            idUsuario: response.usuario.idUsuario,
            userName: response.usuario.nombre + ' ' + response.usuario.apellido,
            role: response.usuario.rol as UserRole,
            isLoggedIn: true,
            token: response.token,
          };
          var ruta;
          if (userData.role === 'Paciente') {
            ruta = 'paciente'
          } else if (userData.role === 'Medico')
            ruta = 'medico'

          this.currentUserSubject.next(userData);
          this.saveUserToLocalStorage(userData);
          this.router.navigate([`/${ruta}`]);

        }),
        catchError((error) => {
          console.error('Error en login:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    this.currentUserSubject.next({
      idUsuario: 0,
      userName: '',
      role: UserRole.PACIENTE, // Valor por defecto, o null si prefieres
      isLoggedIn: false,
      token: ""
    });
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }

  getToken(): string {
    return this.currentUserSubject.value.token;
  }

  getUserRole(): UserRole {
    return this.currentUserSubject.value.role;
  }

  getUserName(): string {
    return this.currentUserSubject.value.userName;
  }
  //si usuario esta logueado return : true
  isLoggedIn(): boolean {
    return this.currentUserSubject.value.isLoggedIn;
  }

  //guarda userData en local storage
  private saveUserToLocalStorage(userData: UserData): void {
    localStorage.setItem('currentUser', JSON.stringify(userData));
  }
  // obtiene userData de localstorage
  private loadUserFromLocalStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const userData: UserData = JSON.parse(storedUser);
      this.currentUserSubject.next(userData);
    }
  }

}




