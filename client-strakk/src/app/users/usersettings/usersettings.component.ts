import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../_models/index';
import { AuthenticationService } from '../../_services/authentication.service';
import { Subscription }   from 'rxjs/Subscription';


/**
 * UsersettingsComponent
 *
 * Edit the currently logged in user
 */
@Component({
  selector: 'app-usersettings',
  templateUrl: './usersettings.component.html',
  styleUrls: ['./usersettings.component.css']
})
export class UsersettingsComponent implements OnInit {

  private userSub;
  private user: User;
  private email: string = "";
          dialogRef: MdDialogRef<DeleteDialog>;

  /**
   * constructor
   *
   * Constructor for UsersettingsComponent
   * Initializes variable user from the AuthenticationService
   * @param AuthenticationService  AuthenticationService
   * The AuthenticationService is injected into UserPanelComponent.
   */
  constructor(
    private router: Router,
    private service: AuthenticationService,
    public dialog: MdDialog) {
      this.userSub = this.service.getCurrentUserObservable().subscribe(user => {
        this.user = user; // Subscribe and get user from the authService
      });
    }

  ngOnInit() {
  }

  /**
   * change Email of the current user
   *
   * Change the email to the value provided
   * * @param  {string} value new email
   */
  changeEmail(value: string) {
    // console.log(this.user.email);
      this.service.changeEmail(value)
          .subscribe(result => {
              if (result === true) {
                  this.router.navigate(['/login']);
              } else {
                  console.error("Error - You cant change your email right now")
              }
          });
  }


  /**
   * changenew Password for this user
   * @param  {string} value new password
   */
  changenewPassword(value: string) {
      this.service.changePassword(value)
          .subscribe(result => {
              if (result === true) {
                  this.router.navigate(['/login']);
              } else {
                  console.error("Error - You cant change your password right now")
              }
          });
  }


  /**
   * Delete the current user
   *
   * Delete the user that is currently loged in
   * The AuthenticationService then handles the actual login.
   */
  delete() {
      this.service.deleteAccoutn()
          .subscribe(result => {
              if (result === true) {
                  this.router.navigate(['/login']);
              } else {
                  console.error("Error - your account might not have been deleted")
              }
          });
  }

  /**
   * Opens a dialog
   *
   * Promts the user to delete the account or not
   */
  openDialog() {
    this.dialogRef = this.dialog.open(DeleteDialog, {
      disableClose: false
    });

    this.dialogRef.afterClosed().subscribe(result => {
      console.log('result: ' + result);
      if (result === "yes"){
        this.delete();
      }
      this.dialogRef = null;
    });
  }

}

/**
 * DeleteDialog
 *
 * Holds dialog logic
 */
@Component({
  selector: 'delete-acccount-dialog',
  template: `
  <h1>Are you sure you want to delete this account?</h1>
  <br>
  <p>Everything will be deleted and unrecoverable!</p>
  <md-dialog-actions>
    <button md-raised-button color="warn"  (click)="dialogRef.close('yes')">Yes, Kill it</button>
    <button md-raised-button color="primary"  md-dialog-close>No I did not mean this!</button>
  </md-dialog-actions>
  `,
  styleUrls: ['./usersettings.component.css']
})
export class DeleteDialog {
  constructor(public dialogRef: MdDialogRef<DeleteDialog>) { }
}
