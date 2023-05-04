import { NgForm } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { PasswordService } from 'src/app/services/password.service';
import { LoginService } from 'src/app/services/login.service';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  showPassword: boolean;
  oldPassword = "";
  submitted:boolean = false;

  @ViewChild("oldPasswordForm", {static:true}) oldPasswordForm:NgForm;

  constructor(private _location:Location,
              private router:Router,
              private loginService: LoginService,
              private passwordService:PasswordService) { }

 
  ngOnInit(): void {

  }

  onBackNavClick(){
    this._location.back();
  }

  newPassword(){
    this.passwordService.oldPassword = this.oldPassword;

    if(this.loginService.passwordReset){
      this.loginService.passwordReset = false;
      
      this.router.navigate(['dashboard/settings/new-password', {password_reset: 1}]);
    } else{
      this.router.navigate(['dashboard/settings/new-password']);
    }
    
  }

}
