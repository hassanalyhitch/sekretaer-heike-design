import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  theme: string;
  language: string;
  authToken:string;

  constructor(private translateService: TranslateService) {

    this.switchTheme(this.getCurrentTheme());

  }
  setAuthToken(authToken:string){
    localStorage.setItem('token',authToken);
  }

  getAuthToken(){
    this.authToken = localStorage.getItem('token');

    if(!this.authToken){
      return '';
    } else {
      return this.authToken;
    }

  }

  setLanguage(){
    this.translateService.use(this.getCurrentLanguage());
  }

  currentSettings(){
    let settings:any[] = [
      this.getCurrentLanguage,
      this.getCurrentTheme
    ]

    return settings;
  }

  setCurrentTheme(theme: string){
    localStorage.setItem('theme_selected', theme);

    //todo : save this THEME to API

    this.switchTheme(theme);
  }

  setCurrentLanguage(lang: string){
    localStorage.setItem('language', lang);

    //TODO : SAVE THIS LANG TO API

    this.translateService.use(lang);
  }

  getCurrentTheme(){
    this.theme = localStorage.getItem('theme_selected');

    if(!this.theme){
      return "default";
    } else {
      return this.theme;
    }
    
  }

  getCurrentLanguage(){
    this.language = localStorage.getItem('language');

    if(!this.language){
      return "en";
    } else {
      return this.language;
    }

  }

  clearSettings(){
    localStorage.clear();
  }
  
  switchTheme(theme_color: string){

    let root:any = document.querySelector(':root');

    switch(theme_color){

      case 'blue':{
        root.style.setProperty("--primaryColor", "#2B71A3");
        root.style.setProperty("--primaryColorDark", "#2A318B");
        root.style.setProperty("--primaryIconColor", "#1989ba");
        root.style.setProperty("--secondaryColor", "#2C262D");
        root.style.setProperty("--primaryLightColor", "#2B71A38A");
        root.style.setProperty("--primaryLightColor-100", "#CFD2ED");
        root.style.setProperty("--primaryButtonColor-100", "#C7E3F7");
        root.style.setProperty("--primaryButtonColor-200", "#CFD2ED");
      }
      break;

      default :{
        root.style.setProperty("--primaryColor", "#E5007E");
        root.style.setProperty("--primaryColorDark", "#D60B51");
        root.style.setProperty("--primaryIconColor", "#D60B51");
        root.style.setProperty("--secondaryColor", "#2C262D");
        root.style.setProperty("--primaryLightColor", "#E5007E8A");
        root.style.setProperty("--primaryLightColor-100", "#EDCFD6");
        root.style.setProperty("--primaryButtonColor-100", "#D8D3E8");   
        root.style.setProperty("--primaryButtonColor-200", "#EBC3CD");
      }
    }

  }

}
