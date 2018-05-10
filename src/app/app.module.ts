import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule, InMemoryDbService } from 'angular-in-memory-web-api';

import { OAuth2Module } from './oauth2/oauth2.module';
import { OAuth2ConnectedGuard } from './oauth2/services/guards/oauth2-connected.guard';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { InMemoryDataService } from './services/in-memory-data.service';
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
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
      dataEncapsulation: false,
      delay: 300,
      passThruUnknownUrl: true
    }),
    OAuth2Module.forRoot(environment.oauth2)
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
    OAuth2ConnectedGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
