import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class NewFolderService {

  constructor(private http: HttpClient) {}

  addNewFolder( folderName:string, parentFolderId:string = "0" ) {
    let data = '{"parentFolderId": "'+parentFolderId+'", "name": "'+folderName+'" }' ;

    let url = 'https://testapi.maxpool.de/api/v1/sekretaer/myfolders';
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
