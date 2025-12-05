import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Démarrage de l'application Angular
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
