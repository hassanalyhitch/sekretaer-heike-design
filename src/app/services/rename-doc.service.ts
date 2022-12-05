import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({ providedIn: 'root' })

export class RenameDocumentService {

  constructor(private http: HttpClient, private loginService: LoginService) {}

  rename(systemId , fileId , data) {
    //console.log(data);

    let url = 'https://testapi.maxpool.de/api/v1/dms/'+systemId+'/'+fileId+'/rename';

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
              this.loginService.emitAuthenticated(false);
            }
          }

        }
      })
    );
  }
}
