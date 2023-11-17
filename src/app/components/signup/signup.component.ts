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


  constructor(
    public as: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) { }


  ngOnInit() {
    this.initFormGroup();
  }


  initFormGroup() {
    this.signUpForm = this.fb.group({
      username: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['']
    }, { validators: this.checkPasswords } as AbstractControlOptions);
  }


  checkPasswords(group: FormGroup): ValidationErrors | null {
    if (!group) {
      return null;
    }

    let pass = group.get('password')?.value;
    let confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { notSame: true };
  }


  async onSubmit() {
    if (this.signUpForm.invalid) {
      return;
    }

    try {
      const formData = this.signUpForm.value;
      let resp: any = await this.as.signup(formData.username, formData.firstname, formData.lastname, formData.email, formData.password);
      localStorage.setItem('token', resp['token']);
      this.router.navigateByUrl('/summary');
    } catch (err) {
      console.error(err);
      this.userAlreadyExists = true;
      setTimeout(() => {
        this.userAlreadyExists = false;
      }, 3000);
    }
  }


}
