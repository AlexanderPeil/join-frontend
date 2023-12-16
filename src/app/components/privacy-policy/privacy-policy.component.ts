import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  showHeaderAndNav!: boolean;
  

  constructor(
    private location: Location,
    private as: AuthService) { }


    /**
     * Go back to the last page.
     */
  goBack(): void {
    this.location.back(); 
  }


  /**
   * Checks in the authService if the user is logged in. In this case sets showHeaderAndNav to true
   * and displays header and nav components. This logic is for the signup component. If the user is
   * on the signup page and clicks on the privacy policy link to ready it (the user has to 
   * accept the terms to signup succesfully), then header and nav should be hidden. 
   */
  ngOnInit(): void {
    this.showHeaderAndNav = this.as.isLoggedIn();
  }

}
