import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { LoginData } from '../models/login.model';

@Injectable({ providedIn: 'root' })

export class LoginService {

  public authToken:string;
  constructor(private http: HttpClient) {}

  login(data: LoginData) {
    return this.http.post('https://testapi.maxpool.de/api/v1/login', data, {
      headers: new HttpHeaders({
        'accept': 'application/json',
        'Content-Type': 'application/json',
      }),
    }).pipe(
      tap((resp:{'token':string})=>{
        
        if(resp.hasOwnProperty("token")){  
          this.authToken = resp.token;
          // console.log(this.authToken);
        } else{
          console.log(resp);
        }
      })
    );
  }
}
