import { Component, OnInit, HostBinding } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../_services/index';
import { User } from '../../_models/user';
import { slideInDownAnimation } from '../../animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [ slideInDownAnimation ]
})

/**
 * LoginComponent
 *
 * Handle login of users
 */
export class LoginComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';
  @HostBinding('style.position')  position = 'absolute';

    model: User = new User();
    loading = false;
    error = '';

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService) { }

    /**
     * Reset loginstatus when the component is first created
     */
    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
    }

    /**
     * Login the current user
     *
     * Requests the user to be logged in through the AuthenticationService.
     * The AuthenticationService then handles the actual logging in.
     */
    login() {
      // console.log(this.model);
        this.loading = true;
        this.authenticationService.login(this.model.email, this.model.password)
            .subscribe(result => {
              // console.log("Got response!")
                if (result === true) {
                    this.router.navigate(['/']);
                } else {
                    this.error = 'Email or password is incorrect';
                    this.loading = false;
                }
            },
            error => {
              this.model.password = "";
              this.error = 'Email or password is incorrect';
              this.loading = false;
            }
          );
    }
}
