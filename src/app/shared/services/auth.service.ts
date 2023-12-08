import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginData, SignUpData } from '../user-interface';
import { jwtDecode } from "jwt-decode";


@Injectable({
  providedIn: 'root',
})


export class AuthService {

  constructor(private http: HttpClient) { }


  signup(formData: SignUpData) {
    const url = environment.baseUrl + '/signup/';
    return lastValueFrom(this.http.post(url, formData));
  }


  login(formData: LoginData) {
    const url = environment.baseUrl + '/login/';
    return lastValueFrom(this.http.post(url, formData));
  }


  signout() {
    const url = environment.baseUrl + '/logout/';
    const headers = new HttpHeaders().set('Authorization', `Token ${localStorage.getItem('token')}`);
    return lastValueFrom(this.http.post(url, {}, { headers: headers }));
  }


  getLoggedUserData() {
    const url = `${environment.baseUrl}/user-info/`;
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.get<SignUpData>(url, { headers: headers }));
  }


  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token; 
  }


  guestLogin() {
    const url = environment.baseUrl + '/guest-login/'; 
    return lastValueFrom(this.http.post(url, {}));
  }

}