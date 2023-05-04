import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { LoginService } from './login.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })

export class NewFolderService {

  constructor(private http: HttpClient, private loginService:LoginService) {}

  addNewFolder( folderName:string, parentFolderId:string = "0" ) {

    let data = '{"parentFolderId": "'+parentFolderId+'", "name": "'+folderName+'" }' ;

    let url = environment.baseUrl +'/api/v1/sekretaer/myfolders';

    return this.http.post(url, data, {
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
