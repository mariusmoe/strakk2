import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { BehaviorSubject }    from 'rxjs/BehaviorSubject';
import { User } from '../_models/user';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map'

/**
 * AuthenticationService is responible for communication about userdata with
 * the API.
 */
@Injectable()
export class AuthenticationService {
    public token: string;
    private user = new User();
    private userSub: BehaviorSubject<User> = new BehaviorSubject<User>(null); // start with null in the userSub
    private urlLogin:string = environment.URL.login;
    private urlDeleteAccoutn:string = environment.URL.deleteAccount;
    private urlChangeEmail:string = environment.URL.changeEmail;
    private urlRegisterUser:string = environment.URL.registerUser;
    private urlRenewJWT: string = environment.URL.renewJWT;
    private urlChangePassword: string = environment.URL.changePassword;

    /**
     * Constructor - set user to current user from localstorage
     *
     * @param http type Http needs to be injected to get http.post etc. to work
     */
    constructor(private http: Http) {
        // set token and user model if saved in local storage
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
          // set token
          this.token          = currentUser.token;
          // set user model
          this.user.email     = currentUser.email;
          this.user.firstName = currentUser.firstName;
          this.user.lastName  = currentUser.lastName;
          this.user.role      = currentUser.role;
          // push user to subscribers
          this.userSub.next(this.user);
        }
    }


    /**
     * getCurrentUserObservable
     *
     * Used to subscribe to currentUser
     */
    getCurrentUserObservable() {
      return this.userSub.asObservable();
    }

    /**
     * login
     *
     * Send a login request to the API with email and password. If the user is
     * recognized, the JWT return by the API is stored in localStorage.
     *
     * @param email     use this email when loging in the user
     * @param password  use this password when loging in the user
     *
     * @return boolean  if login was successful or not
     */
    login(email, password): Observable<boolean> {
      let headers = new Headers({ "content-type": "application/json" });
      let options = new RequestOptions({ headers: headers });
      // let body = 'email='+email + '&password='+password;
      let data = { "email": email, "password": password }
      let body = JSON.stringify(data);

        return this.http.post(this.urlLogin, body, options)
          .map(
            response => {
                if (response.status == 401){
                  console.log("cant login")
                  return false;
                }
                // console.log("tried to connect to del-API");
                // login successful if there's a jwt token in the response
                let json = response.json();
                if (json) {
                    // set token property
                    this.token = json.token;
                    // Is there a better way of doing this(below)
                    this.user.email = json.user.email
                    this.user.firstName = json.user.firstName
                    this.user.lastName = json.user.lastName
                    this.user.role = json.user.role;
                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(
                      {
                        firstName: this.user.firstName,
                        lastName: this.user.lastName,
                        email: email,
                        role: this.user.role,
                        token: this.token
                      })
                    );
                    // push update to our subscribers
                    this.userSub.next(this.user);
                    // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
                }
            },
            error => {
              console.log(error.text());
              return false;
            }
          );
        }

    /**
     * logout
     *
     * Log out the current user and remove that user from localStorage
     */
    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        this.user = new User(); // wipe the slate
        // remove from storage, effectively logging out.
        localStorage.removeItem('currentUser');
        // push null to our subscribers, so that their state is updated.
        this.userSub.next(null);

    }

    /**
     * deleteAccoutn
     *
     * Delete the account that is currently loged in.
     *
     * @return boolean  true if deletion was successful.
     */
    deleteAccoutn(): Observable<boolean> {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      // Add JWT to headder for authorization
      headers.append('Authorization', `${this.token}`);
      let options = new RequestOptions({ headers: headers });
      let url = this.urlDeleteAccoutn;
        return this.http.delete(url, options)
            .map((response: Response) => {
              let json = response.json();
              if (json) {
                if (json.status == 3457 ){
                  this.token = null;
                  this.user = new User(); // wipe the slate
                  localStorage.removeItem('currentUser');
                  this.userSub.next(null);
                  return true;
                }
              }
              else {
                return false;
              }
            })
      }


      /**
       * changeEmail
       *
       * Change the email of this user.
       *
       * @return boolean  true if change was successful.
       */
      changeEmail(email): Observable<boolean> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        // Add JWT to headder for authorization
        headers.append('Authorization', `${this.token}`);
        let data = { "email": email }
        let body = JSON.stringify(data);
        let options = new RequestOptions({ headers: headers });
        let url = this.urlChangeEmail;
          return this.http.post(url, body, options)
              .map((response: Response) => {
                // console.log(response);
                let json = response.json();
                if (json) {
                  if (json.status == 87543 ){
                    this.token = null;
                    this.user = new User(); // wipe the slate
                    localStorage.removeItem('currentUser');
                    this.userSub.next(null);
                    return true;
                  }
                }
                else {
                  return false;
                }
              })
        }


        /**
         * Change password for this user
         * @param  {string}              password the new password
         * @return {Observable<boolean>}          true if successful otherwise false
         */
        changePassword(password): Observable<boolean> {
          let headers = new Headers();
          headers.append('Content-Type', 'application/json');
          // Add JWT to headder for authorization
          headers.append('Authorization', `${this.token}`);
          let data = { "password": password }
          let body = JSON.stringify(data);
          let options = new RequestOptions({ headers: headers });
          let url = this.urlChangePassword;
            return this.http.post(url, body, options)
                .map((response: Response) => {
                  // console.log(response);
                  let json = response.json();
                  if (json) {
                    if (json.status == 723433 ){
                      this.token = null;
                      this.user = new User(); // wipe the slate
                      localStorage.removeItem('currentUser');
                      this.userSub.next(null);
                      return true;
                    }
                  }
                  else {
                    return false;
                  }
                })
          }

      /**
       * register
       *
       * register a new user with membership set to member
       * @param userModel:User  the new user
       *
       * @returns boolean true if successful otherwise false
       */
      register(userModel: User): Observable<boolean> {
        let headers = new Headers({ "content-type": "application/x-www-form-urlencoded" }); //define header-content for http connection
        let body = 'firstName=' + userModel.firstName
          + "&lastName=" + userModel.lastName
          + "&email=" + userModel.email
          + "&password=" + userModel.password;

        let options = new RequestOptions({ headers: headers }); //holds the header

        let url = this.urlRegisterUser;
        return this.http.post(url, body, options)
          .map((response: Response) => {
            let json = response.json(); //make the response from server into a json object
            if(json) { //if the jason object is valid
              return json.status == 200;
            }
            return false;
          })
          .catch((error: any) => { //if something went wrong with the map function and threw a exception
            //get error text  and format it human readable.

            let errMsg = (error.message) ? error.message :
              error.status ? `${error.status} - ${error.statusText}` : 'Server error';
            console.error(errMsg); // log to console instead
            return Observable.throw(errMsg);
          })
      }

      /**
       * renewJWT
       *
       * renew a soon to bee rotten JWT
       *
       * @returns boolean true if successful otherwise false
       */
      renewJWT():Observable<boolean> {
        // console.log("Try to renew JWT")
        //TODO renew JWT
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        // Add JWT to headder for authorization
        headers.append('Authorization', `${this.token}`);
        let options = new RequestOptions({ headers: headers });
        let url = this.urlRenewJWT;
          return this.http.get(url, options)
              .map((response: Response) => {
                let json = response.json();
                // console.log(response);
                if (json) {
                    // set token property
                    this.token = json.token;
                    // Is there a better way of doing this(below)
                    this.user.email = json.user.email
                    this.user.firstName = json.user.firstName
                    this.user.lastName = json.user.lastName
                    this.user.role = json.user.role;
                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(
                      {
                        firstName: this.user.firstName,
                        lastName: this.user.lastName,
                        email: this.user.email,
                        role: this.user.role,
                        token: this.token
                      })
                    );
                    // return true to indicate successful renewal of JWT
                    return true;
                } else {
                    // return false to indicate failed renewal
                    return false;
                }
              }).catch((error:any) => Observable.throw('Server error - cannot renew JWT'));


          }
}
