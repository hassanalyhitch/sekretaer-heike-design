import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  policies:any;

  constructor(private router:Router) {
    this.policies = [
      {
        "title":'PERSONALLY',
        "detail1":'Push Notifications',
        "detail2":'Collapse Insurance',
        "detail3":'Collapse Folder'
      },
      {
        "title":'SETTINGS',
        "detail1":'language',
        "detail2":'your data',
        "detail3":'change your password'
      },
      {
        "title":'OFFICIAL',
        "detail1":'Terms & Conditions',
        "detail2":'Privacy Policy',
      },
  
  
    ]
   }
 

  ngOnInit():void {
  }
 onPolicySelect(){
  this.router.navigate(['privacy-policy']);
 }
}