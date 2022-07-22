import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { LoginService } from "../services/login.service";
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthInterceptorService implements HttpInterceptor {

    auth:string = 'Bearer ';
    authReq:  HttpRequest<any>;

    constructor(private loginService: LoginService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        

        if(this.loginService.authToken!==null && this.loginService.authToken !== undefined){

            this.auth = 'Bearer ' + this.loginService.authToken;
            this.authReq = req.clone({
                headers:req.headers.append('Authorization', this.auth )
            });
        } else {
            //this user is not logged in and is manually writing a url address
            //redirect to home login screen 
            // this.authReq = req.clone({url:''});
            console.log(req.url);
            this.authReq = req.clone();
        }

        if(!req.url.includes('login')){
            //not a login request, token exists ==> send authorized request

            return next.handle(this.authReq)

        } else{
            // login request, no token

            return next.handle(req);
        }

    }
}