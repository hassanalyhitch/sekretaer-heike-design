import { Component, Input, OnInit, VERSION, OnDestroy} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from './services/settings.service';

//new code
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'my-sekretaer',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})

export class AppComponent  implements OnInit, OnDestroy{

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

  showOverlay: boolean = false;

  constructor(
    private loadingService:LoadingService,
    private translate: TranslateService, 
    private settingsService: SettingsService,
    private breakpointObserver: BreakpointObserver
  ){

    //Translator
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    //console.log(browserLang);
    translate.use(browserLang.match(/en|de/) ? browserLang : 'en');

    this.settingsService.currentSettings();

    translate.use(this.settingsService.getCurrentLanguage());

    this.isMobileView = false;
    this.isDesktopView = false;

  }

  ngOnInit(): void {

    this.loadingService.loadingObs.subscribe({
      next:(resp) =>{
        this.showOverlay = resp;
      }
    });

     //--------------------------new code---------------------------
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

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

}
