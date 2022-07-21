import { Component, VERSION } from '@angular/core';
import { TranslateService } from '@ngx-translate/core/lib/translate.service';

@Component({
  selector: 'my-sekretaer',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  
  authenticated: boolean = false;
  lang: string = 'en';

  constructor(private translate: TranslateService){

    //Translator
    translate.setDefaultLang('en');

    // const browserLang = translate.getBrowserLang();
    // translate.use(browserLang.match(/en|de/) ? 'de' : 'en');
  }

  setLang(lang: string){
    this.lang = lang;
    this.translate.use(lang);
  }
}
