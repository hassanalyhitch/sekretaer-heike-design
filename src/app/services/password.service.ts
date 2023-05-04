import { HttpClient,HttpErrorResponse,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { LoginService } from './login.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  
  TAG:string = 'PasswordService  ';

  oldPassword:string = '';

  constructor(private http:HttpClient, private loginService:LoginService) { }

  changeUserPasswordAfterLogin(postData:any){
    let endPoint = environment.baseUrl + '/api/v1/sekretaer/myprofile/password';
    return this.http.post(endPoint,postData,{
          headers: new HttpHeaders({
                  'accept': 'application/json',
                  'Content-Type': 'application/json'
            }),
        }
      ).pipe(
        tap({
          next:(resp)=>{
            // console.log(this.TAG + resp);
          },
          error:(error: any)=>{
            if(error instanceof HttpErrorResponse){
              //Invalid Token or Unauthorised request
              if(error.status == 401){
                this.loginService.emitAuthenticated(false);
              }
            }
          }
        })
      );
  }

  sendPasswordResetLinkToUserEmail(postData:any){

    let endPoint = environment.baseUrl + '/api/v1/login/forgot/password';

    return this.http.post(endPoint,postData,{
          headers: new HttpHeaders({
                  'accept': 'application/json',
                  'Content-Type': 'application/json'
            }),
        }
      ).pipe(
        tap({
          next:(resp)=>{
            // console.log(this.TAG + resp);
          },
          error:(error: any)=>{
            if(error instanceof HttpErrorResponse){
              //Invalid Token or Unauthorised request
              if(error.status == 401){
                this.loginService.emitAuthenticated(false);
              }
            }
          }
        })
      );
  }

}
