import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  showPassword: boolean;

  constructor(private _location:Location,private router:Router) { }

 
  ngOnInit(): void {

  }

  onSubmit(){
   
  }

  onBackNavClick(){
    this._location.back();
  }

  newPassword(){
    this.router.navigate(['dashboard/settings/new-password']);
  }

}
