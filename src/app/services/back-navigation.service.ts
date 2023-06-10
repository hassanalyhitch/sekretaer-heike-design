import { Injectable } from '@angular/core'
import { Location } from '@angular/common'
import { Router, NavigationEnd } from '@angular/router'
import { LoginService } from './login.service';
import { SettingsService } from './settings.service';

@Injectable({ providedIn: 'root' })
export class BackNavigationService {
  history: string[] = [];

  constructor(private router: Router, 
    private location: Location, 
    private loginService: LoginService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects);
      }
    })
  }

  back(): void {
    this.history.pop()
    // console.log("back service called");
    if (this.history.length > 0) {
      this.location.back();
    } else {
      this.router.navigateByUrl('');
    }
  }

  logout(){
    //clear history
    this.history.length = 0;

    //reset auth token and redirect to login    
    this.loginService.resetAuthToken();
  }
}