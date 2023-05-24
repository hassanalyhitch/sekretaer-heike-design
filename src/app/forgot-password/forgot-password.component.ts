import { Component, OnInit } from "@angular/core";
import { FormControl, Validators, FormGroup} from "@angular/forms";
import { PasswordService } from "../services/password.service";
import { TranslateService } from "@ngx-translate/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})

export class ForgotPasswordComponent implements OnInit {

  isFormSubmmited: boolean;

  selected_theme: string;
  app_logo_link_src: string;
  errorMessage: string;

  constructor( 
    private passwordService: PasswordService,
    private translate: TranslateService,
    private snackBar: MatSnackBar
  ) {
    this.app_logo_link_src = "../assets/sekretaer_pink_logo.svg"; //default logo 
    this.selected_theme = "";
    this.isFormSubmmited = false;
    this.errorMessage = "";
  }

  ngOnInit(): void {

    this.selected_theme = localStorage.getItem('theme_selected');

      if(!this.selected_theme){
    
        this.app_logo_link_src = "../assets/sekretaer_pink_logo.svg";

      } else if(this.selected_theme == 'default'){
        //use pink logo
        this.app_logo_link_src = "../assets/sekretaer_pink_logo.svg";
  
      } else if(this.selected_theme == 'blue'){
        //use blue logo
        this.app_logo_link_src = "../assets/sekretar_blue_logo.svg";
        
      }
    
  }

  resetPasswordform = new FormGroup({
    email : new FormControl('', [Validators.required, Validators.email]),
  });
  
  onSubmit() {

    this.passwordService.sendPasswordResetLinkToUserEmail(this.resetPasswordform.value).subscribe({
      next: () => {},
      error: (e) => {

        this.isFormSubmmited = false;

        if (e.error.hasOwnProperty("message")) {

          if(e.error.hasOwnProperty("errors")){

            this.snackBar.open(
              e.error.message,
              this.translate.instant('snack_bar.action_button'),
              {
                duration: 8000,
                panelClass:['snack_error'],
              }
            ); 

          }
        } 
      },
      complete: () => {
        this.isFormSubmmited = true;
      },
    });
  }

}
