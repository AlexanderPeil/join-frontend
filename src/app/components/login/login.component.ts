import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControlOptions, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

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
    public as: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) { }


  ngOnInit(): void {
    this.initAnimation();
    this.initFormGroup();
  }


  initAnimation() {
    setTimeout(() => {
      this.stopAnimation();
    }, 3000);
  }


  initFormGroup() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }


  private stopAnimation(): void {
    this.animationStopped = true;
  }


  async onSubmit() {
    const formData = this.loginForm.value;
    const email = formData.email ?? '';
    const password = formData.password ?? '';

    if (email && password) {
      try {
        let resp: any = await this.as.login(email, password)
        localStorage.setItem('token', resp['token']);
        if (formData.rememberMe) {
          localStorage.setItem('email', email);
        } else {
          localStorage.removeItem('email');
        }
        this.router.navigateByUrl('/summary');
      } catch (err) {
        console.error(err);
        this.isEmailPasswordInvalid = true;
        setTimeout(() => {
          this.isEmailPasswordInvalid = false;
        }, 3000);
      }
    }
  }

}
