import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginData, SignUpData } from '../user-interface';


@Injectable({
  providedIn: 'root',
})


export class AuthService {

  constructor(private http: HttpClient) { }


  /**
   * Sends signup data to the server.
   *
   * Constructs the request URL using the base URL from the environment configuration,
   * and sends the `formData` as a POST request. Converts the Observable to a Promise 
   * using `lastValueFrom`.
   *
   * @param formData - SignUpData object with user signup details.
   * @returns A Promise resolving with the server response.
   */
  signup(formData: SignUpData) {
    const url = environment.baseUrl + '/signup/';
    return lastValueFrom(this.http.post(url, formData));
  }


  /**
   * Sends login data to the server.
   *
   * Constructs the URL for login using the base URL from the environment configuration,
   * and sends the `formData` with the user's login details as a POST request. Utilizes 
   * `lastValueFrom` to convert the Observable returned by `http.post` to a Promise.
   *
   * @param formData - LoginData object containing user's login credentials.
   * @returns A Promise that resolves with the server's response.
   */
  login(formData: LoginData) {
    const url = environment.baseUrl + '/login/';
    return lastValueFrom(this.http.post(url, formData));
  }


  /**
   * Initiates the user sign-out process.
   *
   * Constructs the logout URL using the base URL from the environment configuration. 
   * Sets an 'Authorization' header with the user's token, retrieved from localStorage. 
   * Sends an empty POST request with the authorization headers to log the user out. 
   * Converts the Observable to a Promise using `lastValueFrom`.
   *
   * @returns A Promise that resolves with the server's response to the logout request.
   */
  signout() {
    const url = environment.baseUrl + '/logout/';
    const headers = new HttpHeaders().set('Authorization', `Token ${localStorage.getItem('token')}`);
    return lastValueFrom(this.http.post(url, {}, { headers: headers }));
  }


  /**
   * Retrieves the currently logged-in user's data.
   *
   * Forms a URL to fetch user information from the server using the base URL from 
   * the environment configuration. An 'Authorization' header is set using the token 
   * stored in localStorage. Makes a GET request to the server and returns the user 
   * data as a SignUpData type. Utilizes `lastValueFrom` to convert the Observable 
   * to a Promise.
   *
   * @returns A Promise of SignUpData type resolving with the user's data.
   */
  getLoggedUserData() {
    const url = environment.baseUrl + '/user-info/';
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.get<SignUpData>(url, { headers: headers }));
  }


  /**
   * Checks if a user is currently logged in.
   *
   * Determines the login status by checking for the presence of a 'token' in localStorage.
   * A truthy value of 'token' indicates that the user is logged in, otherwise not.
   *
   * @returns boolean - True if a token is present, indicating a logged-in user; false otherwise.
   */
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }


  /**
   * Initiates a guest login session.
   *
   * Constructs a URL for guest login using the base URL from the environment configuration.
   * Sends an empty POST request to this URL to create a guest user session. Utilizes
   * `lastValueFrom` to convert the Observable returned by `http.post` into a Promise.
   *
   * @returns A Promise that resolves with the server's response to the guest login request.
   */
  guestLogin() {
    const url = environment.baseUrl + '/guest-login/';
    return lastValueFrom(this.http.post(url, {}));
  }

}