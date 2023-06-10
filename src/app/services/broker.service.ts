import { HttpClient,HttpErrorResponse,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { LoginService } from './login.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BrokerService {

  constructor(private http:HttpClient, private loginService:LoginService) { }

  getBrokerDetails(){
    return this.http.get(environment.baseUrl + '/api/v1/sekretaer/myprofile',{
          headers: new HttpHeaders({
                  'accept': 'application/json',
                  'Content-Type': 'application/json'
            }),
        }
      ).pipe(
        tap({
          next:()=>{

          },
          error:(error: any)=>{
            if(error instanceof HttpErrorResponse){
              //Invalid Token or Unauthorised request
              if(error.status == 401){
                this.loginService.resetAuthToken();
              }
            }
          }
        })
      );
  }
}
