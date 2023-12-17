import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoginData } from 'src/app/shared/user-interface';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  animationStopped = false;
  isEmailPasswordInvalid = false;
  loginForm!: FormGroup;


  constructor(
    public authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }


  ngOnInit(): void {
    this.initAnimation();
    this.initFormGroup();
  }


  /**
   * Initializes the Join-Logo animation and sets a timer to stop it after a specific duration.
   */
  initAnimation() {
    setTimeout(() => {
      this.stopAnimation();
    }, 3000);
  }


  /**
   * Initializes the login form with pre-filled data and validation rules.
   * Retrieves and uses a saved username from local storage, if available, and sets up the form controls for 'username', 'password', and 'rememberMe'.
   * 'username' and 'password' are required fields, with 'username' pre-filled if saved in local storage.
   * 'rememberMe' is a boolean indicating whether the username should be remembered.
   */
  initFormGroup() {
    const savedUsername = localStorage.getItem('username');

    this.loginForm = this.formBuilder.group({
      username: [savedUsername || '', Validators.required],
      password: ['', Validators.required],
      rememberMe: [!!savedUsername],
    });
  }


  /**
   * Stops the Join-Logo animation.
   */
  private stopAnimation(): void {
    this.animationStopped = true;
  }


  /**
   * Handles the submission of the login form.
   * Checks if the form is valid and, if so, proceeds to perform the login action.
   */
  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    await this.performLogin();
  }  


  /**
   * Performs the login operation using the form data.
   * Attempts to log in with the provided form data and, on success, stores the received token in local storage.
   * Checks the 'remember me' option and navigates to the summary page upon successful login.
   * Invokes `handleLoginError` to manage any errors during the login process.
   */
  async performLogin() {
    try {
      const formData = this.loginForm.value;
      let resp: any = await this.authService.login(formData);
      localStorage.setItem('token', resp['token']);
      this.checkRememberMe(formData);
      this.router.navigateByUrl('/summary');
    } catch (err) {
      this.handleLoginError();
    }
  }


  /**
   * Handles the 'remember me' functionality for login.
   * Stores the username in local storage if 'remember me' is checked.
   * Removes the username from local storage if 'remember me' is not checked.
   *
   * @param {LoginData} formData - The login form data containing the username and rememberMe status.
   */
  checkRememberMe(formData: LoginData) {
    const username = formData.username;
    if (formData.rememberMe) {
      localStorage.setItem('username', username);
    } else {
      localStorage.removeItem('username');
    }
  }


  /**
   * Handles login errors by setting a flag for invalid email or password.
   * Activates an 'invalid email or password' flag and then resets it after a specified timeout period.
   */
  handleLoginError() {
    this.isEmailPasswordInvalid = true;
    setTimeout(() => {
      this.isEmailPasswordInvalid = false;
    }, 3000);
  }


  /**
   * Handles the guest login process.
   * Prevents event propagation, then attempts a guest login using the authService.
   * On successful login, saves the received token to local storage and navigates to the summary page.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message.
   *
   * @param {MouseEvent} event - The mouse event triggering the guest login.
   */
  async onGuestLogin(event: MouseEvent) {
    event.stopPropagation();
    try {
      const resp: any = await this.authService.guestLogin();
      localStorage.setItem('token', resp['token']);
      this.router.navigateByUrl('/summary');
    } catch (err) {
    }
  }


}
