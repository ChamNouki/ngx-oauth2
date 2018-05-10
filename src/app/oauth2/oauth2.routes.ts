import { Routes, RouterModule } from '@angular/router';
import { OAuth2CallbackComponent } from './components/oauth2-callback.component';
import { ModuleWithProviders } from '@angular/compiler/src/core';

const routes: Routes = [
  {
    component: OAuth2CallbackComponent,
    path: 'oauth2_callback'
  }
];

export const applicationRouter: ModuleWithProviders = RouterModule.forChild(routes);
