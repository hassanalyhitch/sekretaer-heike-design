import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginService } from './login.service';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })

export class BranchService {
    
    constructor (private http:HttpClient, private loginService:LoginService){}
    
    getBranches(){
        
        let url = environment.baseUrl + '/api/v1/masterbranches';
        
        return this.http.get(url,{
           headers:new HttpHeaders({
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
        )

    }

 

    getCompany(Branch2MasterId){
        
        let url = environment.baseUrl + '/api/v1/masterbranches/'+ Branch2MasterId +'/companies';
        
        return this.http.get(url,{
           headers:new HttpHeaders({
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
        )

    }
    getProducts(Branch2MasterId){

      let url = environment.baseUrl + '/api/v1/masterbranches/'+ Branch2MasterId +'/products';
      
      return this.http.get(url,{
        headers:new HttpHeaders({
          'accept': 'application/json',
          'Content-Type': 'application/json',
        }),
      }).pipe(
        tap({
          next:()=>{

          },
          error:(error:any)=>{
            if(error instanceof HttpErrorResponse){
              //Invalid Token or Unauthorised request
              if(error.status == 401){
                this.loginService.resetAuthToken();
              }
            }
          }
        })
      )

    }
}
