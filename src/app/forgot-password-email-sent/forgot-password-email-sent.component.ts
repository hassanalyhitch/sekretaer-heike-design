import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-forgot-password-email-sent',
  templateUrl: './forgot-password-email-sent.component.html',
  styleUrls: ['./forgot-password-email-sent.component.scss']
})
export class ForgotPasswordEmailSentComponent implements OnInit {

  selected_theme: string;
  sekretar_blue_logo: boolean;
  sekretar_pink_logo: boolean;

  constructor(private _location: Location) {
    this.sekretar_blue_logo = false;
    this.sekretar_pink_logo = false;
    this.selected_theme = "";
   }

  ngOnInit(): void {

    this.selected_theme = localStorage.getItem('theme_selected');

    if(this.selected_theme == ""){
      //use default pink logo
      this.sekretar_pink_logo = true;

    } else if(this.selected_theme == 'pink'){
      //use pink logo
      this.sekretar_pink_logo = true;

    } else if(this.selected_theme == 'blue'){
      //use blue logo
      this.sekretar_blue_logo = true;

    }

  }

  onBackToLoginClicked(){
    this._location.back();
  }


}
