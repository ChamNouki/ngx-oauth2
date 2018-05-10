import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { OAuth2Module } from './oauth2/oauth2.module';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    OAuth2Module.forRoot(environment.oauth2)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
