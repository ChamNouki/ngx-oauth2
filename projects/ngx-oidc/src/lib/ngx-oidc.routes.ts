import { Routes, RouterModule } from '@angular/router';
import { OIDCCallbackComponent } from './components/oidc-callback.component';
import { ModuleWithProviders } from '@angular/compiler/src/core';

const routes: Routes = [
  {
    component: OIDCCallbackComponent,
    path: 'oidc_callback'
  }
];

export const applicationRouter: ModuleWithProviders = RouterModule.forChild(routes);
