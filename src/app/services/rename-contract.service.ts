import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { LoginService } from './login.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })

export class RenameContractService {

  constructor(private http: HttpClient, private loginService: LoginService) {}

  rename(vamsidnr, data) {

    let url = environment.baseUrl + '/api/v1/contracts/'+vamsidnr+'/rename';

    return this.http.put(url, data, {
      headers: new HttpHeaders({
        'accept': 'application/json',
        'Content-Type': 'application/json',
      }),
    }).pipe(
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
