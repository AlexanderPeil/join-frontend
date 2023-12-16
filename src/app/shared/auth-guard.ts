import { Injectable } from '@angular/core';
import { RouterStateSnapshot } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private as: AuthService,
    private router: Router) { }


  /**
  * Determines if a route can be activated based on the user's login status.
  * Checks if the user is logged in. If so, allows access to the requested route.
  * If the user is not logged in, redirects to the login page and returns false, preventing access to the route.
  * The intended return URL is passed as a query parameter for potential redirection after login.
  *
  * @param {ActivatedRouteSnapshot} route - Snapshot of the route being activated.
  * @param {RouterStateSnapshot} state - State of the router at the moment of the check.
  * @returns {boolean} True if the route can be activated, false otherwise.
  */
  canActivate(state: RouterStateSnapshot): boolean {
    const isLoggedIn = this.as.isLoggedIn();

    if (isLoggedIn) {
      return true;
    } else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}
