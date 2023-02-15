import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from '../services/login.service';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-change-theme',
  templateUrl: './change-theme.component.html',
  styleUrls: ['./change-theme.component.scss']
})
export class ChangeThemeComponent implements OnInit {

  colors: {
    uiname: string
    name: string,
    selected: boolean
  }[];

  constructor(
    private loginService: LoginService, 
    private translateService: TranslateService,
    private snackBar: MatSnackBar,
    private settingsService: SettingsService
    ) { }

  ngOnInit(): void {

    this.colors =  [
      {uiname: this.translateService.instant('settings.theme_pink'), name: "pink" , selected : false},
      {uiname: this.translateService.instant('settings.theme_blue') ,name : "blue", selected: false}
    ];
    
    for(let i = 0; i<this.colors.length; i++){
      if(this.colors[i].name == this.settingsService.getCurrentTheme())
        this.colors[i].selected = true; 
    }
  }

  onSlideToggle(name:string){

    for(let i = 0; i<this.colors.length; i++){
      if(this.colors[i].name == name && !this.colors[i].selected )
      {
        this.colors[i].selected = true;
        this.settingsService.setCurrentTheme(name);

        //show snackbar with success message
        this.snackBar.open(
          this.translateService.instant('settings.theme_changed_ok'), 
          this.translateService.instant('snack_bar.action_button'),
          { panelClass: ['snack_success'], duration: 5000 }
        );

      } else{
        this.colors[i].selected = false; 
      }
    }
  }

}
