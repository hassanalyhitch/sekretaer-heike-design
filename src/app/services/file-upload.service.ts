import { Injectable } from '@angular/core';
import {HttpClient,HttpErrorResponse,HttpHeaders} from '@angular/common/http';
import {Observable,tap} from 'rxjs';
import { UploadFileData } from '../models/upload-file.model';
import { FileNameData } from '../models/file-name.model';
import { LoginService } from './login.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  TAG:string = 'FileUploadService -> ';
    
  constructor(private http:HttpClient , private loginService: LoginService) {}
  
    // Returns an observable
    addFolderFile(data:FileNameData,folderId:string,tags:string = '',editedName:string ='') {

      // console.log(data.doc_file);
    
      let url = environment.baseUrl + '/api/v1/dms/upload';

      let formData = new FormData();


      formData.append("file",data.doc_file);
      formData.append("folder",folderId);
      formData.append("name",editedName);
      formData.append("tag",tags);
      formData.append("customer","");
      formData.append("agent","");
      formData.append("contract","");
      
      let postData:any = {};

      formData.forEach((value,key)=>{
        postData[key] = value;

      });
      console.log(postData);

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


    addContractFile(data:FileNameData,contractId:string,tags:string ='',editedName:string = '') {

      console.log(this.TAG + data);
      let url = environment.baseUrl + '/api/v1/dms/upload'

      let formData:FormData = new FormData();

      formData.append("file",data.doc_file);
      formData.append("contract",contractId);
      formData.append("name",editedName);
      formData.append("tag",tags);
      formData.append("customer","");
      formData.append("agent","");
      formData.append("folder","");

      console.log(this.TAG + formData);
      

      return this.http.post(url,formData,{
        headers:new HttpHeaders({
          'Accept':'application/json',
        }),
      }).pipe(
        tap({
          next:(resp) =>{

          },
          error:(error:any)=>{
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


