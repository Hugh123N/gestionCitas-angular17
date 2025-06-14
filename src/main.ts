import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { AppShellComponent } from './app/app.shellComponent';


bootstrapApplication(AppShellComponent, appConfig)
  .catch((err) => console.error(err));
