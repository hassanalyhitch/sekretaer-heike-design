import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})

export class PrivacyPolicyComponent implements OnInit{

  inSettings: boolean;
  selected_theme: string;
  app_logo_link_src: string;

  constructor(private _location: Location) { 
    this.app_logo_link_src = "../assets/sekretaer_pink_logo.svg"; //default logo 
    this.selected_theme = "";
    this.inSettings = false;
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

    if(window.location.href.includes("settings")){
      //if logged in
      this.inSettings = true;
    } else {
      //if not logged in
      this.inSettings = false;
    }

  }

  onCloseButtonClicked(){
    this._location.back();
  }

}
