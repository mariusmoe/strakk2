import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';
import { AuthenticationService } from '../_services/authentication.service';



/**
 * AuthGuard
 *
 * used in the routing to check for authentication before accepting the route.
 * The authentication check here is not robust; the actual authentication
 * is done serverside. This class is merely a user-experience helper.
 * Any routes that require authentication that are pointed to prior to a user
 * having been authenticated will be redirected to the login page.
*/

@Injectable()
export class AuthGuard implements CanActivate {

    jwtHelper: JwtHelper = new JwtHelper();

    constructor(
      private router: Router,
      private authenticationService: AuthenticationService) { }

    canActivate() {
        if (localStorage.getItem('currentUser')) {
            // Check if user need a new token?

            // Is there a better way than this?
            let currentUser = localStorage.getItem('currentUser');
            let currentToken = JSON.parse(currentUser);
            let token = currentToken.token;
            let expDate = this.jwtHelper.getTokenExpirationDate(token);
            let alarmTime = new Date(expDate.getTime()*1000 - 10 * 60000);     // 10 min before expDate
            let nowDate = new Date();
            // console.log(
            //   this.jwtHelper.decodeToken(token),
            //   this.jwtHelper.getTokenExpirationDate(token),
            //   this.jwtHelper.isTokenExpired(token)
            // );

            // console.log(alarmTime.getTime())
            // console.log(nowDate.getTime()*1000)

            if (alarmTime.getTime() < (nowDate.getTime()*1000)){
              // Time to renew the JWT
              // console.log("EXPIRED")
              this.authenticationService.renewJWT()
                  .subscribe(result => {
                      if (result === true) {
                          return true;
                      } else {
                        // console.log("Error when trying to renew JWT. You " +
                        // "have been inactive for too long, most likely")
                        this.router.navigate(['/login']);
                        return false;
                      }
                  });
            } else {
              // The user exist in local storage and the token is not out of date
              return true;
            }
        }

        // not logged in so redirect to login page
        this.router.navigate(['/login']);
        return false;
    }
}
