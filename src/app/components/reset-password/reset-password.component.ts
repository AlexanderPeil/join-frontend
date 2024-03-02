import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  isButtonDisabled: boolean = false;
  submitted: boolean = false;
  passwortResetSuccess: boolean = false;
  passwortResetSuccessFail: boolean = false;


  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }


  ngOnInit() {
    this.initFormGroup();
  }


  /**
   * Initializes the form group for the reset password form with validators.
   */
  initFormGroup() {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['']
    }, { validators: this.checkPasswords } as AbstractControlOptions);
  }

  /**
  * Custom validator function that checks if the password and confirm password fields match.
  * @param {FormGroup} group - The form group that contains the password and confirm password fields.
  * @returns {ValidationErrors | null} - Returns an object if validation fails, or null if validation is successful.
  */
  checkPasswords(group: FormGroup): ValidationErrors | null {
    if (!group) {
      return null;
    }

    let pass = group.get('password')?.value;
    let confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  /**
  * Handles the form submission. Validates the form and triggers the password reset process if valid.
  */
  onSubmit() {
    console.log('Try to save passwort', this.resetPasswordForm);
    
    this.submitted = true;
    if (this.resetPasswordForm.invalid) {
      this.handleError();
      return;
    }
    this.performResetPassword();
  }

  /**
  * Performs the password reset operation. It uses a token from the route parameters and the new password from the form.
  */
  async performResetPassword() {    
    let token = this.route.snapshot.queryParamMap.get('token');
    this.toggleButton(true);
    if (!token) return this.handleMissingToken();

    try {
      await this.authService.resetPassword(token, this.resetPasswordForm.value.password);
      this.handleSuccess();
    } catch (err) {
      this.handleError();
    }
  }

  /**
  * Toggles the state of the form submission button and resets the form if enabled.
  * @param {boolean} isDisabled - Determines whether the button should be disabled.
  */
  toggleButton(isDisabled: boolean) {
    this.isButtonDisabled = isDisabled;
    if (!isDisabled) this.resetPasswordForm.reset();
  }

  /**
  * Handles scenarios where the password reset token is missing by logging an error and resetting UI elements.
  */
  handleMissingToken() {
    console.error('Password reset token is missing.');
    this.passwortResetSuccessFail = true;
    setTimeout(() => {
      this.toggleButton(false);
      this.passwortResetSuccessFail = false;
    }, 3000);
  }

  /**
  * Handles the successful password reset operation by navigating to the login page after a short delay.
  */
  handleSuccess() {
    this.passwortResetSuccess = true;
    this.isButtonDisabled = true;
    setTimeout(() => this.router.navigateByUrl('/login'), 3000);
  }

  /**
  * Handles errors during the password reset operation by logging the error and resetting UI elements.
  * @param {any} err - The error object or message encountered during the password reset operation.
  */
  handleError() {
    this.passwortResetSuccessFail = true;
    setTimeout(() => {
      this.toggleButton(false);
      this.passwortResetSuccessFail = false;
    }, 3000);
  }

}
