import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-no-authorize',
  standalone: true,
  imports: [],
  templateUrl: './no-authorize.component.html',
  styleUrl: './no-authorize.component.css'
})
export class NoAuthorizeComponent {

  constructor(private router: Router) {}

  volverInicio() {
    this.router.navigate(['/']);
  }
}
