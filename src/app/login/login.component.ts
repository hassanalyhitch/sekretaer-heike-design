import { HttpClient } from "@angular/common/http";
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  Input,
  OnDestroy,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { LoginData } from "../models/login.model";
import { LoadingService } from "../services/loading.service";
import { LoginService } from "../services/login.service";
import {MatSnackBar} from '@angular/material/snack-bar';
import { TranslateService } from "@ngx-translate/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Subject, takeUntil } from "rxjs";
import * as webauthn from '@passwordless-id/webauthn'
import { environment } from '../../environments/environment';
import * as CryptoJS from 'crypto-js';  
import { LocalforageService } from '../services/localforage.service';
import { SettingsService } from "../services/settings.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit , OnDestroy {
  
  userInput = {};
  buttonDisabled = true;

  username = "";
  password = "";
  submitted: boolean = false;

  //@Output("auth") authenticated = new EventEmitter<boolean>();
  //@Output() lang = new EventEmitter<string>();

  @ViewChild("loginForm", { static: true }) loginForm: NgForm;

  errorMessage: string = null;
  errorStack: string[] = [];

  @Input() privacy_policy: boolean = false;
  @Output() onShowPrivacyPolicy = new EventEmitter<boolean>();

  @Input() terms_and_conditions: boolean = false;
  @Output() onShowTermsAndConditions = new EventEmitter<boolean>();

  @Input() forgot_password: boolean = false;
  @Output() onShowForgotPassword = new EventEmitter<boolean>();

  selected_theme: string;
  app_logo_link_src: string;

  showPassword:boolean;

  destroyed = new Subject<void>();
  currentScreenSize: string;

  bioSetting: boolean = false;

  // Create a map to display breakpoint names for demonstration purposes.
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);

  //--------------------new code------------------------------------- 
  
  isMobileView: boolean;
  isDesktopView: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    private loginService: LoginService,
    private loadingService:LoadingService,
    private translate: TranslateService,
    private breakpointObserver: BreakpointObserver,
    private snackBar: MatSnackBar,
    private localForage: LocalforageService,
    private settingService: SettingsService ){
      this.loadingService.emitIsLoading(false);

      this.app_logo_link_src = "../assets/sekretaer_pink_logo.svg"; //default logo 
      this.selected_theme    = "";
      
      this.showPassword = false;
      this.isMobileView = false;
      this.isDesktopView = false; 
    }

    ngOnInit() {

      this.selected_theme = localStorage.getItem('theme_selected');
      let bioVal = this.settingService.getBiometrics();
      if(bioVal == 'true'){
        this.bioSetting = true;
      } 

      if(!this.selected_theme){
    
        this.app_logo_link_src = "../assets/sekretaer_pink_logo.svg";

      } else if(this.selected_theme == 'default'){
        //use pink logo
        this.app_logo_link_src = "../assets/sekretaer_pink_logo.svg";
  
      } else if(this.selected_theme == 'blue'){
        //use blue logo
        this.app_logo_link_src = "../assets/sekretar_blue_logo.svg";
        
      }

    this.breakpointObserver
     .observe([
       Breakpoints.XSmall,
       Breakpoints.Small,
       Breakpoints.Medium,
       Breakpoints.Large,
       Breakpoints.XLarge,
      ])
     .pipe(takeUntil(this.destroyed))
     .subscribe(result => {
       for (const query of Object.keys(result.breakpoints)) {
         if (result.breakpoints[query]) {

          this.currentScreenSize = this.displayNameMap.get(query) ?? 'Unknown';

          if(this.displayNameMap.get(query) == 'XSmall'){

            this.isMobileView = true;
            this.isDesktopView = false;
      
          } else if(this.displayNameMap.get(query) == 'Small'){
      
            this.isMobileView = true;
            this.isDesktopView = false;
      
          } else if(this.displayNameMap.get(query) == 'Medium'){
      
            this.isMobileView = false;
            this.isDesktopView = true;
      
          } else if(this.displayNameMap.get(query) == 'Large'){
      
            this.isMobileView = false;
            this.isDesktopView = true;
            
          } else if(this.displayNameMap.get(query) == 'XLarge'){
      
            this.isMobileView = false;
            this.isDesktopView = true;
            
          }
      
         }
       }
     });

    }

  validateUser(formData: LoginData) {
    this.loginService.login(formData).subscribe({
      next: (resp) => {
        this.submitted = false;
        if (resp.hasOwnProperty("token")) {
          
          //this.authenticated.emit(true);
          //this.lang.emit(this.loginService.lang);

          if(this.loginService.passwordReset){
            this.router.navigate(['dashboard/settings/change-password']);
          } else {
            this.router.navigate(['dashboard']);
          }

        }
      },
      error: (e) => {

        if (e.error.hasOwnProperty("message")) {

          if(e.error.hasOwnProperty("errors")){

            this.errorMessage = this.translate.instant('login.wrong_credentials_used');

          }

        } else {

          this.errorMessage = this.translate.instant('login.connection_error');
        }

        this.snackBar.open(
          this.errorMessage,
          this.translate.instant('snack_bar.action_button'),
          {
            duration: 8000,
            panelClass:['snack_error'],
          }
        );

        this.submitted = false;
      },
      complete: () => {
        // console.info('complete')
      },
    });
  }

  authenticateBiometric(){
    this.localForage.listKeys().then((keys)=>{
      
      if(keys[1]){
        this.localForage.get(keys[1]).then((encryptedReg)=>{
          
          let biometricRegistration = JSON.parse(CryptoJS.AES.decrypt(encryptedReg, environment.salt_key).toString(CryptoJS.enc.Utf8));
          let authCounter = biometricRegistration.authenticator.counter;
          console.log(authCounter);

          webauthn.client.authenticate([biometricRegistration.credential.id], environment.challenge, {
            "authenticatorType": "auto",
            "userVerification": "required",
            "timeout": 60000
          }).then((authCredentials)=>{
            console.log(authCredentials);
            // this whole function should be in the backend BUT I'm trying to make this work without the backend
            // also the "challenge" is currently stored in the environment file but should be randomized in the backend
            // and sent to the front-end every time a user requests the login page. 
            const listOfAllowedOrigins = [
              "http://localhost:4200",
              "http://192.168.100.220:1555",
              "https://angular-ivy-2kmzni.stackblitz.io",
              "https://apptest.sekretaer-online.de",
              "https://app.sekretaer-online.de"
            ];
            const credentialKey = biometricRegistration.credential;
          
            const expected = {
                challenge: environment.challenge,
                origin: (origin) => listOfAllowedOrigins.includes(origin),
                userVerified: true,
                counter: authCounter
            }
          
            webauthn.server.verifyAuthentication(authCredentials, credentialKey, expected)
            .then((valid)=>{
              // back to frontend
              // now get username and password and call login API endpoint
              console.info("  LOG THIS USER IN !!!!");

              this.localForage.get(keys[0]).then((userData)=>{

                let username = CryptoJS.AES.decrypt(Object.keys(userData)[0], environment.salt_key).toString(CryptoJS.enc.Utf8);
                let password = CryptoJS.AES.decrypt(Object.values(userData)[0], environment.salt_key).toString(CryptoJS.enc.Utf8);
                let data: LoginData = {
                  username: username,
                  password: password,
                  loginType: 'customer'
                }
                
                this.submitted = true;
                this.errorMessage = null;
                console.log(data);
                this.validateUser(data);
              });
            })
            .catch((err)=>{

              console.error(" DONT LOG THIS USER IN !!!!");

              console.log(err);

            });
          });
        });
      }
    });

  }

  onSubmit(formData: LoginData) {
    formData.loginType = "customer";
    this.submitted = true;
    this.errorMessage = null;
    this.validateUser(formData);
  }

  onPolicySelected() { 
    this.router.navigate(['privacy-policy']); 
  }

  onTermsAndConditionSelected() { 
    this.router.navigate(['terms-and-conditions']); 
  }

  onForgotPasswordSelected(){
    this.router.navigate(['forgot-password']);
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
  
}
