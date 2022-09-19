import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class RenameContractService {

  constructor(private http: HttpClient) {}

  rename(vamsidnr, data) {
    let url = 'https://testapi.maxpool.de/api/v1/contracts/'+vamsidnr+'/rename';
    return this.http.post(url, data, {
      headers: new HttpHeaders({
        'accept': 'application/json',
        'Content-Type': 'application/json',
      }),
    }).pipe(
      tap((resp)=>{
        
        console.log(resp);
      })
    );
  }
}
