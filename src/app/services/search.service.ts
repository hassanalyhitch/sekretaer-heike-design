import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class SearchService {

    constructor(private http:HttpClient, private loginService:LoginService) { }

  getSearchResults(query: string){
    return this.http.get(environment.baseUrl + '/api/v1/sekretaer/search?search_term='+query,{
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