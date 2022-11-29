import { HttpClient,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class BrokerService {

  constructor(private http:HttpClient, private loginService:LoginService) { }

  getBrokerDetails(){
    return this.http.get(
        'https://testapi.maxpool.de/api/v1/sekretaer/myprofile',
        {
          headers: new HttpHeaders({
                  'accept': 'application/json',
                  'Content-Type': 'application/json'
            }),
        }
      ).pipe(
        tap({
          next:()=>{

          },
          error:(resp)=>{
            //handle non-200 status codes
            
            //if invalid token emit false
            if(resp.message === "Invalid Token"){
              this.loginService.emitAuthenticated(false);
            }
          }
        })
      );
  }
}
