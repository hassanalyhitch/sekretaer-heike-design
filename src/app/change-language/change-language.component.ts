import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from '../services/login.service';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-change-language',
  templateUrl: './change-language.component.html',
  styleUrls: ['./change-language.component.scss']
})

export class ChangeLanguageComponent implements OnInit {

  languages: {
    name: string,
    symbol: string,
    selected: boolean
  }[];
  
  constructor(
    private translateService: TranslateService, 
    private loginService: LoginService,
    private snackBar: MatSnackBar,
    private settingsService: SettingsService
  ) { }

  ngOnInit(): void {
    // console.log("check lang "+this.loginService.lang);

    this.translateService.use(this.loginService.lang);

    this.languages =  [
      {name: this.translateService.instant('settings.language_de') ,symbol: "de", selected : false},
      {name: this.translateService.instant('settings.language_en') , symbol: "en", selected: false}
    ];

    for(let i = 0; i<this.languages.length; i++){
      if(this.languages[i].symbol == this.loginService.lang)
        this.languages[i].selected = true; 
    }
  }

  onSlideToggleChange(_lang: string) {
    
    //console.log(_lang);

    for(let i = 0; i<this.languages.length; i++){
      if(this.languages[i].symbol == _lang && !this.languages[i].selected )
      {
        this.languages[i].selected = true;
        this.settingsService.setCurrentLanguage(_lang);

        //show snackbar with success message
        this.snackBar.open(
          this.translateService.instant('settings.language_changed_ok'), 
          this.translateService.instant('snack_bar.action_button'),
          { panelClass: ['snack_success'], duration: 5000 }
        );

      } else{
        this.languages[i].selected = false; 
      }
    }

  }

}
