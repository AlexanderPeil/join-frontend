import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { last, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})


export class AuthService {


  constructor(private http: HttpClient) { }


  public signup(username: string, firstname: string, lastname: string, email: string, password: string) {
    const url = environment.baseUrl + '/signup/';
    const body = {
      'username': username,
      'first_name': firstname,
      'last_name': lastname,
      'email': email,
      'password': password
    }
    return lastValueFrom(this.http.post(url, body));
  }


  public login(email: string, password: string) {
    const url = environment.baseUrl + '/login/';
    const body = {
      'email': email,
      'password': password
    }
    return lastValueFrom(this.http.post(url, body));
  }


  async signout() {
    const url = environment.baseUrl + '/logout/';
    await lastValueFrom(this.http.post(url, {}));
  }

}