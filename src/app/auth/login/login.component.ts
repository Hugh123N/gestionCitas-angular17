//import { Component } from '@angular/core';
import { ServiceService } from '../../service/service.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppComponent } from '../../app.component';
import { appConfig } from '../../app.config';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {merge} from 'rxjs';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,
  RouterLink,FormsModule, MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    FlexLayoutModule, MatToolbarModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class LoginComponent {

  readonly email = new FormControl('', [Validators.required, Validators.email]);
  errorMessage = signal('');
  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }


  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }


  mostrarRegistro: boolean = false; // Controla qué formulario mostrar
  emaill: string = '';
  password: string = '';
  nombre: string = '';
  apellido: string = '';
  dni: string = '';
  mensajeError: string = '';

  constructor(private service: ServiceService, private router: Router) {
    console.log('LoginComponent cargado');
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
   }

  alternarFormulario(event: Event) {
    event.preventDefault(); // Previene la recarga de la página
    this.mostrarRegistro = !this.mostrarRegistro;
    this.mensajeError = ''; // Limpiar mensajes al cambiar formulario
  }

  login() {
    if (!this.email || !this.password) {
      this.mensajeError = 'Todos los campos son obligatorios';
      return;
    }

    const usuario = { emaill: this.email, password: this.password };
    this.service.loginUser(usuario).subscribe({
      next: (response) => {
        if (response && response.id) {
          this.router.navigate(['/paciente'], { queryParams: { pacienteId: response.id } });
        } else {
          this.mensajeError = 'Credenciales incorrectas';
        }
      },
      error: (err) => {
        this.mensajeError = 'Error en el inicio de sesión';
      }
    });
  }

  registrar() {
    if (!this.email || !this.password || !this.nombre || !this.apellido || !this.dni) {
      this.mensajeError = 'Todos los campos son obligatorios';
      return;
    }

    const usuario = {
      email: this.emaill,
      password: this.password,
      nombre: this.nombre,
      apellido: this.apellido,
      dni: this.dni
    };

    this.service.registerUser(usuario).subscribe({
      next: () => {
        this.mostrarRegistro = false; // Cambia a login después de registrar
        this.mensajeError = 'Registro exitoso, ahora puedes iniciar sesión';
      },
      error: () => {
        this.mensajeError = 'Error al registrar usuario';
      }
    });
  }


}
