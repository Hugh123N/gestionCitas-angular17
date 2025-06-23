import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
// Angular Material
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// FlexLayout si lo deseas usar en este componente:
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppShellComponent } from "./app.shellComponent";
import { Subscription } from 'rxjs';

import { AuthService } from './service/auth.service';
import { UserRole } from './core/models/roles.enum';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DashboardComponent } from './auth/dashboard/dashboard.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet, NgIf,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule, AppShellComponent, MatDatepickerModule, MatNativeDateModule, DashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  isLoggedIn = false;
  role: string | null = null;
  userName = 'Usuario';
  currentYear = new Date().getFullYear();

  private authSubscription!: Subscription;
  // Acceso al enum de roles en el template
  UserRole = UserRole;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Suscribirse al BehaviorSubject del AuthService para mantener el estado actualizado
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = user.isLoggedIn;
      this.role = user.role;
      this.userName = user.userName;
    });
  }

  ngOnDestroy(): void {
    // Desuscribirse para evitar fugas de memoria
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  logout() {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas salir?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        Swal.fire(
          'Sesión cerrada',
          'Has cerrado sesión correctamente.',
          'success'
        );
      }
    });
  }
}
