import { NgModule }              from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './users/login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './_guards/index';
import { AllComponent } from './recipe/all/all.component';
import { UsersettingsComponent } from './users/usersettings/usersettings.component';
// import { RegisterComponent } from './register/register.component';


const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'all', component: AllComponent, canActivate: [AuthGuard] },
    { path: 'settings', component: UsersettingsComponent, canActivate: [AuthGuard] },
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    // { path: 'register', component: RegisterComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
