import { LoadingService } from './services/loading.service';
import { Component, Input, OnInit, VERSION } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from './services/login.service';

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

  constructor(private translate: TranslateService, private router: Router, private activatedRoute: ActivatedRoute, private loginService: LoginService,private loadingService:LoadingService){

    //Translator
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    console.log(browserLang);
    translate.use(browserLang.match(/en|de/) ? browserLang : 'en');
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
        //change primary app colors
        //TO DO :: store these values on client side and read from client side 1st if available
        let root:any = document.querySelector(':root');
        //case blue
        // root.style.setProperty("--primaryColor", "#2B71A3");
        // root.style.setProperty("--primaryColorDark", "#2A318B");
        // root.style.setProperty("--primaryIconColor", "#1989ba");
        // root.style.setProperty("--secondaryColor", "#2C262D");
        //case default
        // root.style.setProperty("--primaryColor", "#E5007E");
        // root.style.setProperty("--primaryColorDark", "#D60B51");
        // root.style.setProperty("--secondaryColor", "#2C262D");
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
