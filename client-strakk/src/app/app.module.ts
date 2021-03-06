import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing-module';


import { AuthGuard } from './_guards/index';
import { AuthenticationService, RecipeService } from './_services/index';
import { LoginComponent } from './users/login/login.component';
import { UsersettingsComponent, DeleteDialog } from './users/usersettings/usersettings.component';
import { SingleComponent } from './recipe/single/single.component';
import { AllComponent } from './recipe/all/all.component';
import { HomeComponent } from './home/home.component';
import { OneComponent } from './recipe/one/one.component';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsersettingsComponent,
    SingleComponent,
    AllComponent,
    HomeComponent,
    DeleteDialog,
    OneComponent
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    RecipeService
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    MaterialModule.forRoot()
  ],
  entryComponents: [
    DeleteDialog
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
