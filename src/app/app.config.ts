import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatCalendar } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { authInterceptor } from './core/guards/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
  provideHttpClient(
    withInterceptors([
      authInterceptor
    ])
  ),
  provideAnimationsAsync(),
    MatCalendar,
    DatePipe, provideAnimationsAsync(),
  importProvidersFrom(
    BrowserModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    FlexLayoutModule,
    MatToolbarModule,
    FormsModule,//aqui añadi Fernando
    BrowserAnimationsModule
  ),
  provideAnimations()
  ]
};
