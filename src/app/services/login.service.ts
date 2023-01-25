import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Observer, tap } from "rxjs";
import { AuthLogin } from "../models/auth_login.model";
import { LoginData } from "../models/login.model";

@Injectable({ providedIn: "root" })
export class LoginService {
  public authToken: string;
  public lang: string;
  public chatCheck: number;
  public insuranceCheck: number;

  authenticatedObs: Observable<boolean>;
  observer: Observer<boolean>;
  isAuthenticated: boolean = false;

  constructor(private http: HttpClient) {
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
        // tap((resp: { token: string }) => {
        //   if (resp.hasOwnProperty("token")) {
        //     this.authToken = resp.token;
        //     console.log(`Language from server -> ${resp.lang}`);
        //   } else {
        //     console.log(resp);
        //   }
        // })

        tap((resp: AuthLogin) => {
          this.authToken = resp.token;
          this.chatCheck = resp.config.chat;
          this.lang = resp.lang;
          this.insuranceCheck = resp.config.insuranceCheck;
          console.log(resp);

        })
      );
  }
}
