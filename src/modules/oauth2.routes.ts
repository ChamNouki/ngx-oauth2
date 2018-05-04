import { Routes } from '@angular/router';
import { OAuth2CallbackComponent } from '../components/OAuth2-callback.component';

export const routes: Routes = [
  {
    component: OAuth2CallbackComponent,
    path: 'oauth2_callback'
  }
];
