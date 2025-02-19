import { Component } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppComponent } from '../app.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  mostrarRegistro: boolean = false; // Controla qué formulario mostrar
  email: string = '';
  password: string = '';
  nombre: string = '';
  apellido: string = '';
  dni: string = '';
  mensajeError: string = '';

  constructor(private service: ServiceService, private router: Router) {}

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

    const usuario = { email: this.email, password: this.password };
    this.service.loginUser(usuario).subscribe({
      next: (response) => {
        if (response && response.id) {
          this.router.navigate(['/home'], { queryParams: { pacienteId: response.id } });
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
      email: this.email,
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
