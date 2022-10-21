import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class RenameDocumentService {

  constructor(private http: HttpClient) {}

  rename(systemId , fileId , data) {
    console.log(data);
    let url = 'https://testapi.maxpool.de/api/v1/dms/'+systemId+'/'+fileId+'/rename';
    return this.http.put(url, data, {
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
