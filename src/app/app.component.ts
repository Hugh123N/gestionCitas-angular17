import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { NgIf } from '@angular/common';
// Angular Material
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// FlexLayout si lo deseas usar en este componente:
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthService } from './service/auth.service';
import { AppShellComponent } from "./app.shellComponent";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule, AppShellComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  isLoggedIn = false;
  role: string | null = null;
  userName = 'Usuario';

  currentYear = new Date().getFullYear();

  constructor(private authService: AuthService) {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.role = this.authService.getUserRole();
    this.userName = this.authService.getUserName();
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }


}
