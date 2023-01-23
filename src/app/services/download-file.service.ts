import { HttpClient,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(private http:HttpClient) { }

  getDownloadFile(systemId:string, fileId:string ){

    let url = 'https://testapi.maxpool.de/api/v1/dms/'+systemId+'/'+fileId+'/download';

    return this.http.get(
        url,
        {
          headers: new HttpHeaders({'accept': 'application/octetstream'}),
          responseType: 'blob' as const,
          observe: 'response'
        }
      ).pipe(
          tap({
            next:()=>{
              
          }
        })
      );
  }
}
