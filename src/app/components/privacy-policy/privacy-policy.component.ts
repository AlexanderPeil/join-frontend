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


  goBack(): void {
    this.location.back(); 
  }


  ngOnInit(): void {
    this.showHeaderAndNav = this.as.isLoggedIn();
  }

}
