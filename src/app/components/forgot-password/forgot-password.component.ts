import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';


/**
 * @class
 * The SignUpComponent provides the functionality for user registration in the application.
 * @property {FormGroup} signUpForm - The form group instance for the sign up form.
 * @property {boolean} userAlreadyExists - Flag indicating whether the user already exists in the system.
 * @property {boolean} isPasswordTooShort - Flag indicating whether the provided password is too short.
 */
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})


export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  isError: boolean = false;
  isEmailSent: boolean = false;
  submitted: boolean = false;


  /**
   * @param {AuthService} authService - An instance of AuthService for authentication services.
   * @param {Router} router - An instance of Router for routing.
   * @property {FormGroup} forgotPasswordForm - Form group for the forgot password form. 
   */
  constructor(
    private authService: AuthService,
    public router: Router,
    private formBuilder: FormBuilder) {
  }


  ngOnInit(): void {
    this.initFormGroup();
  }


  /**
   * 
   */
  initFormGroup() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }


  /**
   * Submits the form. 
   * If the email is valid, a forgot password email will be sent by authService. 
   * If the email sending is successful, the user is redirected to the login page after 2 seconds. 
   * If the user is not found, an error flag is set.
   */
  async onSubmit() {
    this.submitted = true;
    if (this.forgotPasswordForm.valid) {
      try {
        const email = this.forgotPasswordForm.get('email')?.value;
        await this.authService.forgotPassword(email);
        this.isEmailSent = true;
        setTimeout(() => {
          this.router.navigate(['login']);
        }, 3000);
      } catch (err) {
        this.handleError();
      }
    }
  }


  handleError() {
    this.isError = true;
    setTimeout(() => {
      this.isError = false;
    }, 3000);
  }
}