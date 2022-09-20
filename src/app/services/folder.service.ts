import { formatDate } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { FolderData } from '../models/folder.model';


@Injectable({ providedIn: 'root' })
export class FoldersService {
  selectedFolder: FolderData = <FolderData>{
    id :  "",
    loginId :  "",
    customerAmsidnr :  "",
    ownerFolderId :  "",
    folderName :  "",
    createTime :  "",
    createdAt :  "",
    subFolders : [],

    isSelected:false
  };


  observer: Observer<FolderData>
  selectObservable:Observable<FolderData>;
  userFolderArr:FolderData[] =[];

  constructor(private http: HttpClient) {

    this.selectObservable = new Observable((observer: Observer<FolderData>)=>{
      this.observer = observer;
      this.observer.next(this.selectedFolder);
    });


    this.getFolders().subscribe({
      next: (resp) => {
        this.userFolderArr = [];
        
        // console.table(resp);
        if(Array.isArray(resp)){
          let index: number = 0;

          for(let item of resp){
            //format date 
            // item['createdAt'] = formatDate(item['createdAt'], "dd.MM.YYYY","en");
            //
            let folder: FolderData = {
              id: item['id'],
              loginId : item['loginId'],
              customerAmsidnr:  item['customerAmsidnr'],
              createdAt:  item['createdAt'],         
              ownerFolderId : item['ownerFolderId'],
              folderName : item['folderName'],
              createTime : item['createdAt'],
              subFolders : item['subFolders'],
              docs : item['docs'],
              isSelected:false
            };
            this.userFolderArr.push(folder);
            
            index++;
          }

        } else {
          //invalid token

        }

      },
      error: (e) => {
        console.log(e);
        
      },
      complete: () => {
        // console.info('complete')
      }
    });
  }

  emitSelectedFolder(folder:FolderData){
    this.selectedFolder = folder;
  }
 
  getFolders() {
    return this.http.get(
        'https://testapi.maxpool.de/api/v1/sekretaer/myfolders',
        {
            headers: new HttpHeaders({
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
        });
  }
  getFolderDetails(id:string){
    let url =  'https://testapi.maxpool.de/api/v1/sekretaer/myfolders' + id;
    return this.http.get(
      url,
      {
        headers: new HttpHeaders({
          'accept': 'application/json',
          'Content-Type': 'application/json'
      }),
      
      });
  }
}
