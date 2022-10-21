import { formatDate } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, Subscription, tap } from 'rxjs';
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
      name: "",
      productSek: "",
      tarif: "",
      isFav: 0,
      favoriteId: ""
    },
    isSelected: false
  };
  observer: Observer<ContractData>;
  selectObservable: Observable<ContractData>;
  userContractsArr: ContractData[] = []; 


  constructor(private http: HttpClient) {
    this.selectObservable = new Observable((observer: Observer<ContractData>)=>{
      this.observer = observer;
      this.observer.next(this.selectedContract);
    });
    this._init();
  }

  _init(){

    this.getContracts().subscribe({
      next: (resp) => {
        this.userContractsArr = [];
        
        // console.log("Contract service => "+resp);
        // console.table(resp);
        if(Array.isArray(resp)){
          let index: number = 0;

          for(let item of resp){
            //format date 
            try{

            item['Begin'] = formatDate(item['Begin'], "dd.MM.YYYY","en");
            item['End'] = formatDate(item['End'], "dd.MM.YYYY","en");
            }catch(error){
              console.log(error.message);
            }
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
                name: item['name'],
                productSek: item['ProductSekretaer'],
                tarif: item['tarif'],
                isFav: item['isFavorite'],
                favoriteId: item['favoriteId']
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
    // this.observer.next(contract);
  }


  getContracts() {
    return this.http.get(
        'https://testapi.maxpool.de/api/v1/contracts',
        {
            headers: new HttpHeaders({
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
        }).pipe(
            tap((resp)=>{
              
              this.userContractsArr = [];
              
              // console.log("Contract service => "+resp);
              // console.table(resp);
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
                      name: item['name'],
                      productSek: item['ProductSekretaer'],
                      tarif: item['tarif'],
                      isFav: item['isFavorite'],
                      favoriteId: item['favoriteId']
                      
                    },
                    isSelected: false
                  };
                  this.userContractsArr.push(contract);
                  
                  index++;
                }

              } else {
                //invalid token

              }
            })
          );
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

  makeContractFavourite(contractId){
    let data = '{"type": "contract","item_identifier": "'+contractId+'"}';

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

  deleteContractFavourite(contractId){
    let url = 'https://testapi.maxpool.de/api/v1/sekretaer/favorites/'+contractId;
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

}