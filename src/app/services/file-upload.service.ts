import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable,tap} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
    
  
    
  constructor(private http:HttpClient) { }
  
    // Returns an observable
    addFolderFile(uploadedFile:any,folderId:string) {
    
      let url = 'https://testapi.maxpool.de/api/v1/sekretaer/myfolders/' + folderId +'/upload';
    
      return this.http.post(url,uploadedFile,{
        headers: new HttpHeaders({
          'accept': 'application/json',
          'Content-Type': 'multipart/form-data'
        }),
      }).pipe(
        tap((resp)=>{
          
            console.log(resp);
            
        })
      );
    }
}


