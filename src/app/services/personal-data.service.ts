import { HttpClient,HttpErrorResponse,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class PersonalDataService {

  constructor(private http:HttpClient, private loginService:LoginService) { }

  getMyPersonalDetails(){
    return this.http.get('https://testapi.maxpool.de/api/v1/sekretaer/myprofile',{
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
                this.loginService.emitAuthenticated(false);
              }
            }
          }
        })
      );
  }
}
