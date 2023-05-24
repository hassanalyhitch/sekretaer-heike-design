import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PasswordService } from './../../../../services/password.service';
import { LoginService } from '../../../../services/login.service';


@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {

  showPassword: boolean;
  showNewPassword: boolean;

  newPassword: string;
  confirmNewPassword: string;
  errorMessage: string;

  constructor(
    private _location:Location,
    private router:Router,
    private route:ActivatedRoute,
    private passwordService:PasswordService,
    private snackBar:MatSnackBar,
    private translate:TranslateService,
    private loginService: LoginService
  ) {
    this.newPassword = '';
    this.confirmNewPassword ='';
    this.errorMessage ='';
  }

  ngOnInit(): void {

    let password_reset = this.route.snapshot.paramMap.get('password_reset');

    if(password_reset != null && password_reset === '1'){
      this.loginService.passwordReset = true;
    }

  }
  
  onBackNavClick(){
    this._location.back();
  }

  onreset(){
    if (this.newPassword == this.confirmNewPassword){
      let postData:any = {
        password_old: this.passwordService.oldPassword,
        password_new: this.newPassword,
        password_repeat: this.confirmNewPassword
      };

      //user is logged in, change user password after user is logged in
      this.passwordService.changeUserPasswordAfterLogin(postData).subscribe({
        next:()=>{},
        error:(err)=>{

          if (err.error.errors.hasOwnProperty("password_new")){

            let error_msg = '';

            if(Array.isArray(err.error.errors.password_new)){

                for(let i=0;i<err.error.errors.password_new.length;i++){
                  error_msg = error_msg.concat(err.error.errors.password_new[i],'\n');
                };

                this.snackBar.open(
                  error_msg,
                  this.translate.instant('snack_bar.action_button'),
                  {
                    duration: 10000,
                    panelClass:['snack_error'],
                  }
                );

            }

          } else{
            this.errorMessage = err.error.message;
            
            this.snackBar.open(
              this.errorMessage,
              this.translate.instant('snack_bar.action_button'),
              {
                duration: 8000,
                panelClass:['snack_error'],
              }
            );
          }
        
        },
        complete:()=>{
          this.loginService.passwordReset = false;
          this.router.navigate(['dashboard/settings/password-reset-successful']);
        }
      });
        
    }else{
      
      this.snackBar.open(
         this.translate.instant('new-password.password_unconfirmed'),this.translate.instant('snack_bar.action_button'),
        {
          duration: 8000,
          panelClass:['snack_error'],
        }
      );
    }
    
  }


}
