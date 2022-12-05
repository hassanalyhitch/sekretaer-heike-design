import { HttpClient,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(private http:HttpClient) { }

  getDownloadFile(linkToDoc:string ){

    let url = 'https://testapi.maxpool.de'+linkToDoc;

    return this.http.get(
        url,
        {
          headers: new HttpHeaders({}),
          responseType: 'blob' as 'json' 
        }
      );
  }
}
