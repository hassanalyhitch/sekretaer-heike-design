import { Component, OnInit, VERSION } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'my-sekretaer',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  implements OnInit{
  
  authenticated: boolean = false;
  lang: string = 'en';
  show_privacy_policy: boolean = false;
  show_terms_and_conditions: boolean = false;
  show_forgot_password: boolean = false;

  constructor(private translate: TranslateService, private router: Router, private activatedRoute: ActivatedRoute){

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
    })
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
