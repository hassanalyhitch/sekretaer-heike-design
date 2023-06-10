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

  @Output("auth") authenticated = new EventEmitter<boolean>();
  @Output() lang = new EventEmitter<string>();
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
    private snackBar: MatSnackBar ){
      this.loadingService.emitIsLoading(false);

      this.app_logo_link_src = "../assets/sekretaer_pink_logo.svg"; //default logo 
      this.selected_theme    = "";
      
      this.showPassword = false;
      this.isMobileView = false;
      this.isDesktopView = false; 
    }

    ngOnInit() {

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
          this.authenticated.emit(true);
          this.lang.emit(this.loginService.lang);

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
