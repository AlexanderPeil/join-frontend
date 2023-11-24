import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { SignUpData } from '../user-interface';


@Injectable({
  providedIn: 'root',
})


export class AuthService {


  constructor(private http: HttpClient) { }


  public signup(formData: SignUpData) {
    const url = environment.baseUrl + '/signup/';
    return lastValueFrom(this.http.post(url, formData));
  }


  public login(formData: SignUpData) {
    const url = environment.baseUrl + '/login/';
    return lastValueFrom(this.http.post(url, formData));
  }


  async signout() {
    const url = environment.baseUrl + '/logout/';
    await lastValueFrom(this.http.post(url, {}));
  }

}