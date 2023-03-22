import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, tap } from 'rxjs';
import { AuthLogin } from '../models/auth_login.model';
import { LoginData } from '../models/login.model';
import { SettingsService } from './settings.service';

@Injectable({ providedIn: 'root' })
export class LoginService {
  public authToken: string;
  public lang: string;
  public themeColor: string;
  public chatCheck: number;
  public insuranceCheck: number;

  authenticatedObs: Observable<boolean>;
  observer: Observer<boolean>;
  isAuthenticated: boolean = false;

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {
    this.authenticatedObs = new Observable((observer: Observer<boolean>) => {
      this.observer = observer;
      this.cacheOps();
      this.observer.next(this.isAuthenticated);
    });
  }

  cacheOps() {
    console.log("cacheOps");
    let now = new Date();
    let lastCache = localStorage.getItem('lastCache');

    if (lastCache !== null || lastCache !== undefined) {
      let cacheDateTime = new Date(lastCache);
      let cacheExpiry = cacheDateTime;
      cacheExpiry.setHours(cacheDateTime.getHours() + 1);

      if (cacheExpiry > now) {
        console.log('Not expired.');
        console.log('Will expire on => '+cacheExpiry);
      } else {
        console.log('Expired. Clear Cache.');
        console.log('Already expired on => '+cacheExpiry);
        
        try{

          const deleteCache = async (key) => {
            await caches.delete(key);
          };
  
          const deleteOldCaches = async () => {
            const keyList = await caches.keys();
            console.log(keyList);
            await Promise.all(keyList.map(deleteCache));
          };
  
          deleteOldCaches();
          localStorage.setItem('lastCache', now.toString());
          location.reload();
          
        } catch(e:any){
          console.log(e);
        }
        
      }
    }

  }

  emitAuthenticated(isValid: boolean) {
    this.observer.next(isValid);
  }

  login(data: LoginData) {
    return this.http
      .post('https://testapi.maxpool.de/api/v1/login', data, {
        headers: new HttpHeaders({
          accept: 'application/json',
          'Content-Type': 'application/json',
        }),
      })
      .pipe(
        tap((resp: AuthLogin) => {
          let now = new Date();

          this.authToken = resp.token;
          this.chatCheck = resp.config.chat;
          this.themeColor = resp.config.colorSchema; //api theme color;
          this.lang = resp.lang;
          this.insuranceCheck = resp.config.insuranceCheck;

          this.settingsService.setCurrentTheme(this.themeColor);
          this.settingsService.setCurrentLanguage(this.lang); 

          localStorage.setItem('lastCache', now.toString());
        })
      );
  }
}
