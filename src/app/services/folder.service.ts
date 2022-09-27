import { formatDate } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, Subscription, tap } from 'rxjs';
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
    isFavorite: 0,
    favoriteId: "",

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
        }).pipe(
          tap((resp)=>{

            this.userFolderArr = [];
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
                  isFavorite: item['isFavorite'],
                  favoriteId: item['favoriteId'],
                  isSelected:false
                };
                this.userFolderArr.push(folder);
                
                index++;
              }
    
            } else {
              //invalid token
    
            }
          }

        ));
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
  
  makeFolderFavourite(folderId){
    let data = '{"type": "folder","item_identifier": "'+folderId+'"}';

    return this.http.post('https://testapi.maxpool.de/api/v1/sekretaer/favorites', data, {
      headers: new HttpHeaders({
        'accept': 'application/json',
        'Content-Type': 'application/json',
      }),
    }).pipe(
      tap((resp)=>{
        
          console.log(data);
          
      })
    );
  }

  deleteFolderFavourite(favId){
    let url = 'https://testapi.maxpool.de/api/v1/sekretaer/favorites/'+favId;
    return this.http.delete(url, {
      headers: new HttpHeaders({
        'accept': 'application/json',
        'Content-Type': 'application/json',
      }),
    }).pipe(
      tap((resp)=>{
        
          console.log(url);
          
      })
    );
  }
  
  rename(folderId, data) {
    let url = 'https://testapi.maxpool.de/api/v1/sekretaer/myfolders/'+folderId;
    return this.http.put(url, data, {
      headers: new HttpHeaders({
        'accept': 'application/json',
        'Content-Type': 'application/json',
      }),
    }).pipe(
      tap((resp)=>{
        console.log(resp);
        let folder: FolderData = {
          id: resp['id'],
          loginId : resp['loginId'],
          customerAmsidnr:  resp['customerAmsidnr'],
          createdAt:  resp['createdAt'],         
          ownerFolderId : resp['ownerFolderId'],
          folderName : resp['folderName'],
          createTime : resp['createdAt'],
          subFolders : resp['subFolders'],
          docs : resp['docs'],
          isFavorite: resp['isFavorite'],
          favoriteId: resp['favoriteId'],
          isSelected: true
        }
        this.emitSelectedFolder(folder);
      })
    );
  }
}
