import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, tap } from 'rxjs';
import { AuthLogin } from '../models/auth_login.model';
import { LoginData } from '../models/login.model';
import { SettingsService } from './settings.service';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';  
import { environment } from '../../environments/environment';
import { LocalforageService } from './localforage.service';
import * as webauthn from '@passwordless-id/webauthn'

@Injectable({ providedIn: 'root' })
export class LoginService {
 
  public themeColor: string;
  public chatCheck: number;
  public insuranceCheck: number;
  public passwordReset: boolean;

  // authenticatedObs: Observable<boolean>;
  // observer: Observer<boolean>;
  // public isAuthenticated: boolean = false;

  constructor(
    private http: HttpClient,
    private route: Router,
    private settingsService: SettingsService,
    private localForage: LocalforageService
  ) {
    
    // this.authenticatedObs = new Observable((observer: Observer<boolean>) => {
    //   this.observer = observer;
    //   this.cacheOps();
    //   this.observer.next(this.isAuthenticated);
    // });

    this.cacheOps();
  }

  cacheOps() {
    //console.log("cacheOps");
    let now = new Date();
    let lastCache = localStorage.getItem('lastCache');

    if (lastCache !== null || lastCache !== undefined) {
      let cacheDateTime = new Date(lastCache);
      let cacheExpiry = cacheDateTime;
      cacheExpiry.setHours(cacheDateTime.getHours() + 1);

      if (cacheExpiry > now) {
        //console.log('Not expired.');
        //console.log('Will expire on => '+cacheExpiry);
      } else {
        //console.log('Expired. Clear Cache.');
        //console.log('Already expired on => '+cacheExpiry);
        
        try{

          const deleteCache = async (key) => {
            await caches.delete(key);
          };
  
          const deleteOldCaches = async () => {
            const keyList = await caches.keys();
            //console.log(keyList);
            await Promise.all(keyList.map(deleteCache));
          };
  
          deleteOldCaches();
          localStorage.setItem('lastCache', now.toString());
          location.reload();
          
        } catch(e:any){
          //console.log(e);
        }
        
      }
    }

  }

  // emitAuthenticated(isValid: boolean) {
  //   //console.log("emitAuthenticated in login service "+isValid);
  //   //this.observer.next(isValid);
  //   //console.log("Auth Status "+this.isAuthenticated);
    
  //   if(!isValid){
  //     this.isAuthenticated = isValid;
  //     //console.log("emitAuthenticated 2"+isValid);
  //     this.route.navigate(['login']);
  //   }
  // }

  login(data: LoginData) {
    let endPoint = environment.baseUrl + '/api/v1/login';
    return this.http
      .post(endPoint, data, {
        headers: new HttpHeaders({
          accept: 'application/json',
          'Content-Type': 'application/json',
        }),
      })
      .pipe(
        tap((resp: AuthLogin) => {
          let now = new Date();

          //this.isAuthenticated = true;
          this.chatCheck = resp.config.chat;
          this.themeColor = resp.config.colorSchema; 
          this.insuranceCheck = resp.config.insuranceCheck;
          this.passwordReset = resp.config.passwordReset;

          this.settingsService.setCurrentTheme(this.themeColor);
          this.settingsService.setCurrentLanguage(resp.lang);
          this.settingsService.setAuthToken(resp.token);

          localStorage.setItem('lastCache', now.toString());

          let encUserName = CryptoJS.AES.encrypt(data.username, environment.salt_key).toString();
          let encPassword = CryptoJS.AES.encrypt(data.password, environment.salt_key).toString();
          
          // console.log("Your encrypted user name is " + encUserName);
          // console.log("Your decrypted user name is " + CryptoJS.AES.decrypt(encUserName, environment.salt_key).toString(CryptoJS.enc.Utf8));
          let storeObj = {};
          storeObj[encUserName] = encPassword;

          this.localForage.set("_0", storeObj);          
        })
      );
  }

  resetAuthToken(){
    //reset auth token
    this.settingsService.setAuthToken('');
    //navigate to login
    this.route.navigate(['login']);
  }
}
