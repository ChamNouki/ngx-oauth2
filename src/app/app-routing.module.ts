import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OIDCConnectedGuard } from 'ngx-oidc';

import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroesComponent } from './heroes/heroes.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'detail/:id',
    component: HeroDetailComponent,
    canActivate: [OIDCConnectedGuard]
  },
  { path: 'heroes', component: HeroesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
