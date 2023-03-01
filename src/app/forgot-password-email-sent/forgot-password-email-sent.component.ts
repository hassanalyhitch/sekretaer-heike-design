import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-forgot-password-email-sent',
  templateUrl: './forgot-password-email-sent.component.html',
  styleUrls: ['./forgot-password-email-sent.component.scss']
})
export class ForgotPasswordEmailSentComponent implements OnInit {

  selected_theme: string;
  app_logo_link_src: string;

  constructor(private _location: Location) {
    this.app_logo_link_src = "../assets/sekretaer_pink_logo.svg"; //default logo 
    this.selected_theme = "";
   }

  ngOnInit(): void {

    this.selected_theme = localStorage.getItem('theme_selected');

    if(!this.selected_theme){
  
      this.app_logo_link_src = "../assets/sekretaer_pink_logo.svg";

    } else if(this.selected_theme == 'pink'){
      //use pink logo
      this.app_logo_link_src = "../assets/sekretaer_pink_logo.svg";

    } else if(this.selected_theme == 'blue'){
      //use blue logo
      this.app_logo_link_src = "../assets/sekretar_blue_logo.svg";
      
    }

  }

  onBackToLoginClicked(){
    this._location.back();
  }


}
