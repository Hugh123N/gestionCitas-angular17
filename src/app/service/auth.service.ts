import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserRole } from '../core/models/roles.enum';
import { FormControl } from '@angular/forms';

interface UserData {
  userName: string;
  role: UserRole;
  isLoggedIn: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private router = inject(Router);

  // BehaviorSubject para mantener el estado de autenticación del usuario
  private currentUserSubject: BehaviorSubject<UserData> =
    new BehaviorSubject<UserData>({
      userName: '',
      role: UserRole.PACIENTE, // Valor por defecto, se sobrescribirá al iniciar sesión
      isLoggedIn: false,
    });

  public currentUser$: Observable<UserData> =
    this.currentUserSubject.asObservable();

  constructor() {
    // Intentar cargar la información del usuario del localStorage al iniciar el servicio
    this.loadUserFromLocalStorage();
  }

  /**
   * Simula el inicio de sesión. En un proyecto real, esto haría una llamada a una API
   * y almacenaría el token y la información del usuario.
   * @param username El nombre de usuario.
   * @param password La contraseña.
   * @param role El rol del usuario (para simulación).
   */
  login(email: string, password: string): void {
    // Lógica real: Llamada a la API de login
    // Si la autenticación es exitosa:
    let userData: UserData;
    if (email === "paciente@gmail.com") {
      userData = pacienteUser;
    } else if (email === 'medico@gmail.com') {
      userData = medicoUser;
    } else if (email === 'admin@gmail.com') {
      userData = adminUser;
    } else {
      console.error('Usuario de prueba no reconocido.');
      return;
    }
    this.currentUserSubject.next(userData);
    this.saveUserToLocalStorage(userData);
    this.router.navigate(['/']);
  }

  logout(): void {
    this.currentUserSubject.next({
      userName: '',
      role: UserRole.PACIENTE, // Valor por defecto, o null si prefieres
      isLoggedIn: false,
    });
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
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

  //guarda informacion en local storage
  private saveUserToLocalStorage(userData: UserData): void {
    localStorage.setItem('currentUser', JSON.stringify(userData));
  }
  // obtiene informacion de localstorage
  private loadUserFromLocalStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const userData: UserData = JSON.parse(storedUser);
      this.currentUserSubject.next(userData);
    }
  }

}


const pacienteUser = {
  userName: 'Ana Garcia',
  email: "paciente@gmail.com",
  role: UserRole.PACIENTE,
  isLoggedIn: true,
};

// Objeto de prueba para un Médico
const medicoUser = {
  userName: 'Dr. Carlos Lopez',
  email: 'medico@gmail.com',
  role: UserRole.MEDICO,
  isLoggedIn: true,
};

// Objeto de prueba para un Administrador
const adminUser = {
  userName: 'Admin Global',
  email: 'admin@gmail.com',
  role: UserRole.ADMIN,
  isLoggedIn: true,
};



