import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  constructor() { }

  resetPasswordForm = new FormGroup({
    'currentpassword': new FormControl(null,Validators.required),
    'newpassword': new FormControl(null,Validators.required),
    'confirmpassword': new FormControl(null,Validators.required),
  });

  ngOnInit(): void {
  }
  onSubmit(){
    console.log(this.resetPasswordForm);
  }

}
