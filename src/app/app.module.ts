import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgxOidcModule, OIDCConnectedGuard } from 'ngx-oidc';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { HeroService } from './services/hero.service';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroesComponent } from './heroes/heroes.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { HeroSearchComponent } from './hero-search/hero-search.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxOidcModule.forRoot(environment.oidc)
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    HeroSearchComponent,
    HeroesComponent,
    HeroDetailComponent
  ],
  providers: [
    HeroService,
    OIDCConnectedGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
