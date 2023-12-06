import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isDropdownOpen = false;

  constructor(
    public authService: AuthService,
    private router: Router) { }


  showLogout() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }


  async onLogout() {
    try {
      await this.authService.signout();
      localStorage.removeItem('token');
      this.router.navigateByUrl('/login');
    } catch (err) {
      console.error(err);
    }
  }


  stopPropagation(event: Event) {
    event.stopPropagation();
  }

}
