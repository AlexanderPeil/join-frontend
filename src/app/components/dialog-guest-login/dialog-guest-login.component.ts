import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DialogErrorComponent } from '../dialog-error/dialog-error.component';


@Component({
  selector: 'app-dialog-guest-login',
  templateUrl: './dialog-guest-login.component.html',
  styleUrls: ['./dialog-guest-login.component.scss']
})
export class DialogGuestLoginComponent {
  loggingIn: boolean = false;


  constructor(
    public dialogRef: MatDialogRef<DialogGuestLoginComponent>,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog) { }


  /**
 * Handles the guest login process.
 * Prevents event propagation, then attempts a guest login using the authService.
 * On successful login, saves the received token to local storage and navigates to the summary page.
 * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message.
 */
  async onGuestLogin() {
    try {
      if (!this.authService.storageToken) {
        this.loggingIn = true;
        const resp: any = await this.authService.guestLogin();
        this.authService.token$.next(resp['token']);
      }
      this.router.navigateByUrl('/summary');
      this.closeDialog();
    } catch (err) {
      this.handleError();
      console.error(err);
    }
  }


  closeDialog() {
    this.dialogRef.close();
  }


  /**
* Opens a dialog using DialogErrorComponent to show error messages in a unified manner.
* @returns {void} Nothing is returned by this method.
 */
  handleError(): void {
    this.dialog.open(DialogErrorComponent, {
    });
  }

}
