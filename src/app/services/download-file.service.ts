import { HttpClient,HttpErrorResponse,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from "rxjs";
import { environment } from '../../environments/environment';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(private http: HttpClient, private loginService: LoginService) { }

  getDownloadFile(systemId:string, fileId:string ){

    let url = environment.baseUrl + '/api/v1/dms/'+systemId+'/'+fileId+'/download';

    return this.http.get(
        url,
        {
          headers: new HttpHeaders({'accept': 'application/octetstream'}),
          responseType: 'blob' as const,
          observe: 'response'
        }
      ).pipe(
          tap({
            next:()=>{},
            error:(error:any) => {
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

  getBase64DownloadFile(systemId:string, fileId:string ){

    let url = environment.baseUrl + '/api/v1/dms/'+systemId+'/'+fileId;

    return this.http.get(
        url,
        {
          headers: new HttpHeaders({'accept': 'application/octetstream'}),
          observe: 'response'
        }
      ).pipe(
          tap({
            next:()=>{},
            error:(error:any) => {
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
