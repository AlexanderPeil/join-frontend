import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControlOptions, ValidationErrors } from '@angular/forms';
import { AuthService } from "../../shared/services/auth.service";
import { Router } from '@angular/router';


@Component({
  selector: 'app-sign-up',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})


export class SignUpComponent implements OnInit {
  userAlreadyExists = false;
  signUpForm!: FormGroup;
  submitted = false;
  signedUpInfo!: boolean;
  isButtonDisabled = false;


  constructor(
    public authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }


  ngOnInit() {
    this.initFormGroup();
  }


  /**
   * Initializes the sign-up form with form controls and validation rules.
   * Sets up form controls for username, firstname, lastname, email, password, privacyPolicy, and confirmPassword.
   * Includes individual validations for each field, such as required fields and email format.
   * Adds a custom validator 'checkPasswords' to ensure password and confirmPassword match.
   */
  initFormGroup() {
    this.signUpForm = this.formBuilder.group({
      username: ['', Validators.required],
      first_name  : ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      privacyPolicy: [false, Validators.requiredTrue],
      confirmPassword: ['']
    }, { validators: this.checkPasswords } as AbstractControlOptions);
  }


  /**
   * Custom validator for checking if the password and confirmPassword fields in a FormGroup match.
   * Returns a validation error object if passwords don't match, otherwise returns null.
   *
   * @param {FormGroup} group - The FormGroup containing the password fields to be validated.
   * @returns {ValidationErrors | null} - An object with validation error 'notSame' if mismatched, or null if valid.
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
   * Handles the submission of the signUpForm.
   * Sets the 'submitted' flag to true and checks if the form is valid.
   * If the form is valid, proceeds to perform the signup process.
   */
  async onSubmit() {
    this.submitted = true;

    if (this.signUpForm.invalid) {
      return;
    }
    await this.performSignup();
  }


  /**
   * Performs the signup operation using the formData.
   * Attempts to sign up with the provided formData and, on success, stores the received token in local storage.
   * Sets flags for successful signup and disables the submit button.
   * Navigates to the summary page after a brief delay upon successful signup.
   * Invokes `handleSignUpError` to manage any errors during the signup process.
   */
  async performSignup() {
    try {
      const formData = this.signUpForm.value;
      let resp: any = await this.authService.signup(formData);
      localStorage.setItem('token', resp.token);
      this.signedUpInfo = true;
      this.isButtonDisabled = true;
      setTimeout(() => {
        this.router.navigateByUrl('/summary');
      }, 3000);
    } catch (err) {
      this.handlySignUpError();
    }
  }


  /**
   * Manages the error scenario during the signup process.
   * Activates a 'user already exists' flag and then resets it after a specified timeout period.
   * This function is typically used to provide feedback to the user in case of a signup error.
   */
  handlySignUpError() {
    this.userAlreadyExists = true;
    setTimeout(() => {
      this.userAlreadyExists = false;
    }, 3000);
  }
}