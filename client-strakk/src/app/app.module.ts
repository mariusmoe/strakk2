import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing-module';


import { AuthGuard } from './_guards/index';
import { AuthenticationService } from './_services/index';
import { LoginComponent } from './users/login/login.component';
import { UsersettingsComponent } from './users/usersettings/usersettings.component';
import { SingleComponent } from './recipe/single/single.component';
import { AllComponent } from './recipe/all/all.component';
import { HomeComponent } from './home/home.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsersettingsComponent,
    SingleComponent,
    AllComponent,
    HomeComponent
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    MaterialModule.forRoot()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
