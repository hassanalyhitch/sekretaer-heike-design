import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  selected_theme: string;
  app_loading_logo_link_src: string;

  constructor() { 
    this.app_loading_logo_link_src = "../assets/icon_loading_logo_pink.svg"; //default logo 
    this.selected_theme = "";
  }

  ngOnInit(): void {

    this.selected_theme = localStorage.getItem('theme_selected');

      if(!this.selected_theme){
    
        this.app_loading_logo_link_src = "../assets/icon_loading_logo_pink.svg";

      } else if(this.selected_theme == 'default'){
        //use pink logo
        this.app_loading_logo_link_src = "../assets/icon_loading_logo_pink.svg";
  
      } else if(this.selected_theme == 'blue'){
        //use blue logo
        this.app_loading_logo_link_src = "../assets/icon_loading_logo_blue.svg";
        
      }
      
  }

}
