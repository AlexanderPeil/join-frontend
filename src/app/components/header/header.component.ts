import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DialogErrorComponent } from '../dialog-error/dialog-error.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isDropdownOpen = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    public dialog: MatDialog) { }


  /**
   * Opens the dropdown-menu in the header
   */
  showLogout() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }


  /**
   * Handles the user logout process.
   * Attempts to sign out the user using the authService, clears the local storage token, and navigates to the login page.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message.
   */
  async onLogout() {
    try {
      await this.authService.signout();
      localStorage.removeItem('token');
      this.router.navigateByUrl('/login');
    } catch (err) {
      this.handleError();
    }
  }


  /**
   * Prevents further propagation of the current event in the capturing and bubbling phases.
   *
   * @param {Event} event - The DOM event to be stopped from propagating.
   */
  stopPropagation(event: Event) {
    event.stopPropagation();
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
