import { Injectable } from '@angular/core';
import {HttpClient,HttpErrorResponse,HttpHeaders} from '@angular/common/http';
import {Observable,tap} from 'rxjs';
import { UploadFileData } from '../models/upload-file.model';
import { FileNameData } from '../models/file-name.model';
import { LoginService } from './login.service';
@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
    
  constructor(private http:HttpClient , private loginService: LoginService) {}
  
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
        tap({
          next:(resp)=>{
              
          },
          error:(error: any)=>{
  
            if(error instanceof HttpErrorResponse){
              //Invalid Token or Unauthorised request
              if(error.status == 401){
                this.loginService.emitAuthenticated(false);
              }
            }
            
          } 
        })
      );
    }
}


