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
    return lastValueFrom(this.http.post(url, {}));
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
    return lastValueFrom(this.http.get<SignUpData>(url));
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


  /**
     Initiates a password reset for a user by their email.
   * Sends a POST request to the backend with the user's email to start the password reset process. 
   * The backend should then send a reset token to the provided email if it exists in the database.
   * @param email The email address of the user requesting a password reset.
   * @returns A promise that resolves with the server's response to the password reset request.
    */
  forgotPassword(email: string) {
    const url = environment.baseUrl + '/api/password_reset/';
    return lastValueFrom(this.http.post(url, { email: email }));
  }

  /**
    Sends a POST request to the backend with the reset token and new password to finalize the password reset. 
   * The backend verifies the token's validity and, if successful, updates the user's password with the provided new password.
   * @param token The password reset token provided to the user via email or other means.
   * @param password The new password chosen by the user.
   * @returns A promise that resolves with the backend's response, typically indicating the success or failure of the password update.
   */
  resetPassword(token: string, password: string) {
    const url = environment.baseUrl + '/api/password_reset/confirm/';
    return lastValueFrom(this.http.post(url, { token: token, password: password }));
  }


  /**
     Sends a POST request to the backend with the reset token to validate its authenticity and validity. 
   * This is typically used before allowing the user to proceed with setting a new password.
   *
   * @param token The password reset token to be validated.
   * @returns A promise that resolves with the server's response, indicating whether the token is valid.
  */
  validateToken(token: string) {
    const url = environment.baseUrl + '/api/password_reset/validate_token/';
    return lastValueFrom(this.http.post(url, { token: token }));
  }

}