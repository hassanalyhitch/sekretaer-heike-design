import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Observer, tap } from "rxjs";
import { AuthLogin } from "../models/auth_login.model";
import { LoginData } from "../models/login.model";
import { SettingsService } from "./settings.service";

@Injectable({ providedIn: "root" })
export class LoginService {
  public authToken: string;
  public lang: string;
  public themeColor: string;
  public chatCheck: number;
  public insuranceCheck: number;

  authenticatedObs: Observable<boolean>;
  observer: Observer<boolean>;
  isAuthenticated: boolean = false;

  constructor(private http: HttpClient, private settingsService: SettingsService) {
    this.authenticatedObs = new Observable((observer:Observer<boolean>)=>{
      this.observer = observer;
      this.observer.next(this.isAuthenticated);
    });
  }

  emitAuthenticated(isValid: boolean){
    this.observer.next(isValid);
  }

  login(data: LoginData) {
    return this.http
      .post("https://testapi.maxpool.de/api/v1/login", data, {
        headers: new HttpHeaders({
          accept: "application/json",
          "Content-Type": "application/json",
        }),
      })
      .pipe(

        tap((resp: AuthLogin) => {
          this.authToken = resp.token;
          this.chatCheck = resp.config.chat;
          this.themeColor = resp.config.colorSchema; //api theme color;
          this.lang = resp.lang;
          this.insuranceCheck = resp.config.insuranceCheck;

          this.settingsService.setCurrentTheme(this.themeColor);
          this.settingsService.setCurrentLanguage(this.lang);
        })
      );
  }
}
