import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-dialog-guest-login',
  templateUrl: './dialog-guest-login.component.html',
  styleUrls: ['./dialog-guest-login.component.scss']
})
export class DialogGuestLoginComponent {


  constructor(
    public dialogRef: MatDialogRef<DialogGuestLoginComponent>,
    private authService: AuthService,
    private router: Router) { }


  /**
 * Handles the guest login process.
 * Prevents event propagation, then attempts a guest login using the authService.
 * On successful login, saves the received token to local storage and navigates to the summary page.
 * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message.
 */
  async onGuestLogin() {
    try {
      localStorage.removeItem('token'); 
      const resp: any = await this.authService.guestLogin();
      localStorage.setItem('token', resp['token']);
      this.router.navigateByUrl('/summary');
    } catch (err) {
    }
  }


  closeDialog() {
    this.dialogRef.close();
  }

}
