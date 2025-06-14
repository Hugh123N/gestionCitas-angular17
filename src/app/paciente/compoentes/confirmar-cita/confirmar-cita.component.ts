import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { ServiceService } from '../../../service/service.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmar-cita',
  standalone: true,
  imports: [FlexLayoutModule, MatProgressSpinnerModule, MatButtonModule, MatCardModule, CommonModule
    
  ],
  templateUrl: './confirmar-cita.component.html',
  styleUrl: './confirmar-cita.component.css',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ConfirmarCitaComponent {
  @Input() resumenCita: any;
  @Output() confirmar = new EventEmitter<void>();

  confirmando = false;

  constructor(private route: ActivatedRoute,
    private router: Router, private service: ServiceService) { }

  onConfirmar() {
    this.confirmando = true;

    // Simulación de espera de API
    setTimeout(() => {
      this.confirmando = false;
      this.confirmar.emit();
    }, 1500);
  }

}
