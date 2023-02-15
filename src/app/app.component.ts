import { LoadingService } from './services/loading.service';
import { Component, Input, OnInit, VERSION } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from './services/login.service';
import { SettingsService } from './services/settings.service';

@Component({
  selector: 'my-sekretaer',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  implements OnInit{
  
  @Input() authenticated: boolean = false;
  lang: string = 'en';
  show_privacy_policy: boolean = false;
  show_terms_and_conditions: boolean = false;
  show_forgot_password: boolean = false;

  showOverlay:boolean=false;

  current_theme: string;

  constructor(
    private translate: TranslateService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private loginService: LoginService,
    private loadingService:LoadingService,
    private settingsService: SettingsService
  ){

    //Translator
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    console.log(browserLang);
    translate.use(browserLang.match(/en|de/) ? browserLang : 'en');

    this.settingsService.currentSettings();

    translate.use(this.settingsService.getCurrentLanguage());

  }

  ngOnInit(): void {

    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        // do something...
        if(this.router.url != "/privacy-policy"){
          this.show_privacy_policy = false;
        } 
        if(this.router.url != "/terms-and-conditions"){
          this.show_terms_and_conditions = false;
        }
        if(this.router.url != "/forgot-password"){
          this.show_forgot_password = false;
        }
      }
    });

    this.loginService.authenticatedObs.subscribe({
      next:(resp)=>{
        if(resp === false){
          this.authenticated = false;
        }
        
      }
    });

    this.loadingService.loadingObs.subscribe({
      next:(resp) =>{
        this.showOverlay = resp;
      }
    });
  }

  showPrivacyPolicy(event){
    this.show_privacy_policy = event;
    this.router.navigate(['privacy-policy']);
  }

  showTerms(event){
    this.show_terms_and_conditions = event;
    this.router.navigate(['terms-and-conditions']);
  }

  showForgotPassword(event){
    this.show_forgot_password = event;
    this.router.navigate(['forgot-password']);
  }

  setLang(lang: string){
    this.lang = lang;
    this.translate.use(lang);
  }
}
