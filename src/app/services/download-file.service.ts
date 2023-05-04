import { HttpClient,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, tap } from "rxjs";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(private http:HttpClient) { }

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
            next:()=>{
              
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
            next:()=>{
              
          }
        })
      );
  }
}
