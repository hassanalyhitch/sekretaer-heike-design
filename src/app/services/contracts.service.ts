import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { ContractData } from '../models/contract.model';


@Injectable({ providedIn: 'root' })
export class ContractsService {
  selectedFolder: ContractData;
  observer: Observer<ContractData>;
  selectFolderObservable = new Observable((observer: Observer<ContractData>)=>{
    this.observer = observer;
    this.observer.next(this.selectedFolder);
  });


  constructor(private http: HttpClient) {
  }

  emitSelectedFolder(folder:ContractData){
    this.selectedFolder = folder;
    this.observer.next(folder);
  }


  getContracts() {
    return this.http.get(
        'https://testapi.maxpool.de/api/v1/contracts',
        {
            headers: new HttpHeaders({
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
        });
  }
}