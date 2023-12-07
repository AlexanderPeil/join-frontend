import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
    const savedUsername = localStorage.getItem('username');

    this.loginForm = this.fb.group({
      username: [savedUsername || '', Validators.required],
      password: ['', Validators.required],
      rememberMe: [!!savedUsername],
    });
  }


  private stopAnimation(): void {
    this.animationStopped = true;
  }


  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    try {
      const formData = this.loginForm.value;
      const username = formData.username;
      let resp: any = await this.as.login(formData);
      localStorage.setItem('token', resp['token']);

      if (formData.rememberMe) {
        localStorage.setItem('username', username);
      } else {
        localStorage.removeItem('username');
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


  async onGuestLogin(event: MouseEvent) {
    event.stopPropagation();
    try {
      const resp: any = await this.as.guestLogin();
      localStorage.setItem('token', resp['token']);
      this.router.navigateByUrl('/summary');
    } catch (err) {
      console.error(err);
    }
  }


}
