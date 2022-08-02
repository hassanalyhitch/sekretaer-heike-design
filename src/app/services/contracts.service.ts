import { formatDate } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { ContractData } from '../models/contract.model';


@Injectable({ providedIn: 'root' })
export class ContractsService {
  selectedContract: ContractData = <ContractData>{
    id: 0,
    details: {
      Amsidnr: "",
      CustomerAmsidnr: "",
      InsuranceId: "",
      ContractNumber: "",
      Company: "",
      StartDate: "",
      EndDate: "",
      YearlyPayment: "",
      Paymethod: "",
      Branch: "",
      Risk: "",
      docs: [],
      isFav: 0
    },
    isSelected: false
  };
  observer: Observer<ContractData>;
  selectObservable: Observable<ContractData>;
  userContractsArr: ContractData[]; 


  constructor(private http: HttpClient) {
    this.selectObservable = new Observable((observer: Observer<ContractData>)=>{
      this.observer = observer;
      this.observer.next(this.selectedContract);
    });
    this.getContracts().subscribe({
      next: (resp) => {
        this.userContractsArr = [];
        
        // console.log("Servicing => "+resp);
        if(Array.isArray(resp)){
          let index: number = 0;

          for(let item of resp){
            //format date 
            item['Begin'] = formatDate(item['Begin'], "dd.MM.YYYY","en");
            item['End'] = formatDate(item['End'], "dd.MM.YYYY","en");
            //
            let contract: ContractData = {
              id: index,
              details: {
                Amsidnr: item['Amsidnr'],
                CustomerAmsidnr:  item['CustomerAmsidnr'],
                InsuranceId:  item['Contractnumber'],
                ContractNumber:  item['Contractnumber'],
                Company:  item['Company'],
                StartDate:  item['Begin'],
                EndDate:  item['End'],
                YearlyPayment:  item['YearlyPayment'],
                Paymethod:  item['PaymentMethod'],
                Branch:  item['Branch'],
                Risk:  item['Risk'],
                docs: item['docs'],
                isFav: item['isFavorite']
              },
              isSelected: false
            };
            this.userContractsArr.push(contract);
            
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

  emitSelectedFolder(contract:ContractData){
    this.selectedContract = contract;
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

  getContractDetails(Amsidnr: string){
    let url = 'https://testapi.maxpool.de/api/v1/contracts/'+Amsidnr;
    
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