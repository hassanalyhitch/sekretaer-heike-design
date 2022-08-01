import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { ContractData } from '../models/contract.model';


@Injectable({ providedIn: 'root' })
export class ContractsService {
  selectedContract: ContractData;
  observer: Observer<ContractData>;
  selectObservable: Observable<ContractData>; 


  constructor(private http: HttpClient) {
    this.selectObservable = new Observable((observer: Observer<ContractData>)=>{
      this.observer = observer;
      this.observer.next(this.selectedContract);
    });
  }

  emitSelectedFolder(contract:ContractData){
    this.selectedContract = contract;
    console.log(this.selectedContract);
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