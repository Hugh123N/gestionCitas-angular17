import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn(): boolean {
    return true; // Simulación por ahora
  }

  getUserRole(): string {
    return 'PACIENTE'; // Simulación de rol
  }

  getUserName(): string {
    return 'Hugo'; // Simulación de nombre
  }

  logout(): void {
    // Lógica real: eliminar token, limpiar sesión
    console.log('Sesión cerrada');
  }
}






