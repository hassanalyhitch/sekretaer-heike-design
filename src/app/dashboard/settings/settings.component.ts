import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackNavigationService } from '../../services/back-navigation.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  
  constructor(private router:Router, private navigation: BackNavigationService) {}
  
  ngOnInit():void {}

  onPolicySelect(){ this.router.navigate(['privacy-policy']); }

  onTermsAndConditionSelected(){ this.router.navigate(['terms-and-conditions']); }

  onLogoutSelect(){
    this.navigation.logout();
  }
}