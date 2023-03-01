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

  onPolicySelect(){ 
    this.router.navigate(['dashboard/settings/privacy-policy']); 
  }

  onTermsAndConditionSelected(){ 
    this.router.navigate(['dashboard/settings/terms-and-conditions']); 
  }

  onLogoutSelect(){
    this.navigation.logout();
  }
  
  onMyData(){
    this.router.navigate(['dashboard/settings/my-data']);
  }

  onChangePassword(){
    this.router.navigate(['dashboard/settings/change-password']);
  }

  onChangeAppTheme(){
    this.router.navigate(['dashboard/settings/change-theme']);
  }

  onChangeAppLanguage(){
    this.router.navigate(['dashboard/settings/change-language']);
  }

  onChangePushNotificationSettings(){
    this.router.navigate(['dashboard/settings/change-push-notifications']);
  }
}