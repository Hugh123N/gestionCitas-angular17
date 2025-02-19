import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CitaService } from '../service/cita.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  especialidades: any[] = [];
  medicos: any[] = [];
  selectedEspecialidad: number | null = null;
  especialidadSeleccionada: string = ''; // Almacena el nombre de la especialidad seleccionada
  doctorSeleccionado: string = ''; // Almacena el nombre del doctor seleccionado
  idDoctorSeleccionado: number | null = null;
  pacienteId: string = '';

  constructor(private service: ServiceService, private citaService:CitaService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.cargarEspecialidades();
    // Obtenemos el id del paciente desde los queryParams
    this.route.queryParams.subscribe(params => {
      this.pacienteId = params['pacienteId'];
    });
  }

  //lista de especialidades
  cargarEspecialidades(): void {
    this.service.getEspecialidades().subscribe(
      (data: any) => {
        this.especialidades = data;
      },
      (error) => {
        console.error('Error al obtener especialidades:', error);
      }
    );
  }

  onEspecialidadChange(event: any): void {
    const id = event.target.value;

    const especialidad = this.especialidades.find(esp => esp.id == id);
    if (especialidad) {
      this.especialidadSeleccionada = especialidad.nombre;
      this.citaService.setEspecialidad(especialidad.id, especialidad.nombre);
    }

    if (id) {
      this.service.getMedicosByEspecialidad(id).subscribe(
        (data: any) => {
          this.medicos = data;
          this.doctorSeleccionado = ''; // Borra el doctor si se cambia la especialidad
        },
        (error) => {
          console.error('Error al obtener médicos:', error);
        }
      );
    } else {
      this.medicos = [];
    }
  }

  onDoctorChange(event: any): void {
    const idDoctor = event.target.value;
    const medico = this.medicos.find(doc => doc.id == idDoctor);
    if (medico) {
      this.doctorSeleccionado = medico.nombre;
      this.idDoctorSeleccionado = medico.id;
      this.citaService.setMedico(medico.id, medico.nombre);
    }  
  
  }

  irAAgenda() {
    if (!this.especialidadSeleccionada || !this.doctorSeleccionado) {
      alert('Seleccione una especialidad y un doctor.');
      return;
    }
    this.router.navigate(['/agenda-fecha'], {
      queryParams: {
        especialidad: this.especialidadSeleccionada,
        doctor: this.doctorSeleccionado,
        idDoctor: this.idDoctorSeleccionado,
        pacienteId: this.pacienteId
      }
    });
  }

}
