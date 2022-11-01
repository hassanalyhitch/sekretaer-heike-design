import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable,tap} from 'rxjs';
import { UploadFileData } from '../models/upload-file.model';
import { FileNameData } from '../models/file-name.model';
@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
    
  
    
  constructor(private http:HttpClient) { }
  
    // Returns an observable
    addFolderFile(data:FileNameData,folderId:string) {

      // console.log(data.doc_file);
    
      let url = 'https://testapi.maxpool.de/api/v1/sekretaer/myfolders/' + folderId +'/upload';

      let formData = new FormData();

      formData.append("file",data.doc_file);

    
      return this.http.post(url,formData,{
        headers: new HttpHeaders({
          'Accept':'application/json',
        }),
      }).pipe(
        tap((resp)=>{
          
            console.log(resp);
            
        })
      );
    }
}


