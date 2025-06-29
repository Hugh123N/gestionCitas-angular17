//import { Component } from '@angular/core';
import { ServiceService } from '../../service/service.service';
import { Router } from '@angular/router';
import { FormGroup, FormsModule } from '@angular/forms';
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
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { AuthService } from '../../service/auth.service';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,
    RouterLink, FormsModule, MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    FlexLayoutModule, MatToolbarModule, MatIconModule, ReactiveFormsModule, MatSelectModule, MatOptionModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class LoginComponent {

  private authService = inject(AuthService);


  mostrarRegistro: boolean = false;
  mensajeError: string = '';

  readonly loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  readonly registroForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellido: new FormControl('', [Validators.required]),
    sexo: new FormControl('', [Validators.required]),
    telefono: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    contrasenia: new FormControl('', [Validators.required, Validators.minLength(6)]),
    fechaNacimiento: new FormControl('', [Validators.required]),
    talla: new FormControl('', [Validators.required]),
    grupoSanguineo: new FormControl('', [Validators.required]),
    direccion: new FormControl('')
  });

  errorMessage = signal('');

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  constructor(private service: ServiceService, private router: Router) {

  }

  alternarFormulario(event: Event) {
    event.preventDefault(); // Previene la recarga de la página
    this.mostrarRegistro = !this.mostrarRegistro;
  }

  registrar() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    const nuevoUsuario = this.registroForm.value;
    this.service.registrarPaciente(nuevoUsuario).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Tu cuenta ha sido creada correctamente.',
          confirmButtonText: 'Ir al login',
          confirmButtonColor: '#1976d2'
        }).then(() => {
          this.alternarFormulario(new Event('click')); // Volver al login
        });
      },
      error: err => {
        console.error(err);
        this.errorMessage.set('Error al registrar el usuario');
      }
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe({
      next: () => {
        console.log('Login exitoso');
      },
      error: (err) => {
        console.error('Error al iniciar sesión:', err);
      }
    });
  }

  volverInicio() {
    this.router.navigate(['/']);
  }
}
