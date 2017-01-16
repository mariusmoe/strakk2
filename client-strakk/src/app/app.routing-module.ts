import { NgModule }              from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './users/login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './_guards/index';
// import { UsersettingsComponent } from './usersettings/index';
// import { RegisterComponent } from './register/register.component';
//
// import { MapViewComponent } from './map/map.component';
// import { AddarticleComponent } from './addarticle/addarticle.component';
// import { ArticlePageComponent} from './articlepage/index';




const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    // { path: 'add_article', component: AddarticleComponent, canActivate: [AuthGuard] },
    // { path: 'my_account', component: UsersettingsComponent, canActivate: [AuthGuard] },
       { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    // { path: 'register', component: RegisterComponent },
    // { path: 'map', component: MapViewComponent, canActivate: [AuthGuard]  },
    // { path: 'article/:articleid', component: ArticlePageComponent, canActivate: [AuthGuard] },

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
