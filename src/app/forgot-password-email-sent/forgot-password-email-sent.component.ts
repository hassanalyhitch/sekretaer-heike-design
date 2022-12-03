import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-forgot-password-email-sent',
  templateUrl: './forgot-password-email-sent.component.html',
  styleUrls: ['./forgot-password-email-sent.component.scss']
})
export class ForgotPasswordEmailSentComponent implements OnInit {

  constructor(private _location: Location) { }

  ngOnInit(): void {
  }

  onBackToLoginClicked(){
    this._location.back();
  }


}
