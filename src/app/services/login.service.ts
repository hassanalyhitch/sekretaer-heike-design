import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap } from "rxjs";
import { AuthLogin } from "../models/auth_login";
import { LoginData } from "../models/login.model";

@Injectable({ providedIn: "root" })
export class LoginService {
  public authToken: string;
  public lang: string;
  public chatCheck: number;
  public insuranceCheck: number;

  constructor(private http: HttpClient) {}

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
          //console.log(resp);
        })
      );
  }
}
