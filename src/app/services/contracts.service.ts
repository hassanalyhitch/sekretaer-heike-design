import { formatDate } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, Subscription, tap } from 'rxjs';
import { ContractData } from '../models/contract.model';
import { LoginService } from './login.service';


@Injectable({ providedIn: 'root' })
export class ContractsService {
  selectedContract: ContractData = <ContractData>{
    id: 0,
    details: {
      Amsidnr:         "",
      CustomerAmsidnr: "",
      InsuranceId:     "",
      ContractNumber:  "",
      Company:         "",
      StartDate:       "",
      EndDate:         "",
      YearlyPayment:   "",
      Paymethod:       "",
      Branch:          "",
      Risk:            "",
      docs: [],
      name:            "",
      productSek:      "",
      tarif:           "",
      isFav: 0,
      favoriteId:      ""
    },
    isSelected: false
  };
  observer: Observer<ContractData>;
  selectObservable: Observable<ContractData>;
  userContractsArr: ContractData[] = []; 


  constructor(private http: HttpClient, private loginService: LoginService ) {
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
            let contract: ContractData = {
              id: index,
              details: {
                Amsidnr:         item['Amsidnr'],
                CustomerAmsidnr: item['CustomerAmsidnr'],
                InsuranceId:     item['Contractnumber'],
                ContractNumber:  item['Contractnumber'],
                Company:         item['Company'],
                StartDate:       item['Begin'],
                EndDate:         item['End'],
                YearlyPayment:   item['YearlyPayment'],
                Paymethod:       item['PaymentMethod'],
                Branch:          item['Branch'],
                Risk:            item['Risk'],
                docs:            item['docs'],
                name:            item['name'],
                productSek:      item['ProductSekretaer'],
                tarif:           item['tarif'],
                isFav:           item['isFavorite'],
                favoriteId:      item['favoriteId']
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
        console.log('Error in fetching contracts ->'+e);
        
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
    return this.http.get('https://testapi.maxpool.de/api/v1/contracts',{
            headers: new HttpHeaders({
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
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
          }));
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
      }).pipe(
        tap({
          next:(resp)=>{
            let contract: ContractData = {
              id:                resp['Amsidnr'],
              details: {
                Amsidnr:         resp['Amsidnr'],
                CustomerAmsidnr: resp['CustomerAmsidnr'],
                InsuranceId:     resp['Contractnumber'],
                ContractNumber:  resp['Contractnumber'],
                Company:         resp['Company'],
                StartDate:       resp['Begin'],
                EndDate:         resp['End'],
                YearlyPayment:   resp['YearlyPayment'],
                Paymethod:       resp['PaymentMethod'],
                Branch:          resp['Branch'],
                Risk:            resp['Risk'],
                docs:            resp['docs'],
                name:            resp['name'],
                productSek:      resp['ProductSekretaer'],
                tarif:           resp['tarif'],
                isFav:           resp['isFavorite'],
                favoriteId:      resp['favoriteId']
              },
              isSelected:        true
            };

            this.selectedContract = contract;
          },
          error:(error: any)=>{

            if(error instanceof HttpErrorResponse){
              //Invalid Token or Unauthorised request
              if(error.status == 401){
                this.loginService.emitAuthenticated(false);
              }
            }
            
          }
        }));
  }

  makeContractFavourite(contractId){
    let data = '{"type": "contract","item_identifier": "'+contractId+'"}';

    return this.http.post('https://testapi.maxpool.de/api/v1/sekretaer/favorites', data, {
      headers: new HttpHeaders({
        'accept': 'application/json',
        'Content-Type': 'application/json',
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

  deleteContractFavourite(contractId){
    let url = 'https://testapi.maxpool.de/api/v1/sekretaer/favorites/'+contractId;
    return this.http.delete(url, {
      headers: new HttpHeaders({
        'accept': 'application/json',
        'Content-Type': 'application/json',
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