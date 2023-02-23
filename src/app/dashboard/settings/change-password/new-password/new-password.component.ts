import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {
  showPassword:boolean;
  showNewPassword:boolean;

  constructor(private _location:Location,private router:Router) { }

  ngOnInit(): void {

  }
  
  onBackNavClick(){
    this._location.back();
  }

  onreset(){
    this.router.navigate(['dashboard/settings/password-reset-successful']);
  }


}
