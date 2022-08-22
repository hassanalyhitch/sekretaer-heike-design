import { formatDate } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { ContractData } from '../models/contract.model';
import { FolderData } from '../models/folder.model';


@Injectable({ providedIn: 'root' })
export class FoldersService {
  folder: FolderData = <FolderData>{
    id :  "",
    loginId :  "",
    customerAmsidnr :  "",
    ownerFolderId :  "",
    folderName :  "",
    createTime :  "",
    createdAt :  "",
    subFolders : []
  };
  observer: Observer<FolderData>;
  selectObservable: Observable<FolderData>;
  userFoldersArr: FolderData[]; 


  constructor(private http: HttpClient) {

    this.selectObservable = new Observable((observer: Observer<FolderData>)=>{
      this.observer = observer;
      this.observer.next(this.folder);
    });

    this.getFolders().subscribe({
      next: (resp) => {
        this.userFoldersArr = [];
        
        // console.log("Servicing => "+resp);
        if(Array.isArray(resp)){
          let index: number = 0;

          for(let item of resp){
            //format date 
            item['createdAt'] = formatDate(item['createdAt'], "dd.MM.YYYY","en");
            //
            let folder: FolderData = {
              id: item['id'],
              loginId : item['loginId'],
              customerAmsidnr:  item['customerAmsidnr'],
              createdAt:  item['createdAt'],         
              ownerFolderId : item['ownerFolderId'],
              folderName : item['folderName'],
              createTime : item['createdAt'],
              subFolders : []              
            };
            this.userFoldersArr.push(folder);
            
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
    this.folder = folder;
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

}