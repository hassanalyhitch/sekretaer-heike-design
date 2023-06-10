import { FileNameData } from './../models/file-name.model';
import { FileUploadService } from './file-upload.service';
import { formatDate } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Observer, Subscription, tap } from 'rxjs';
import { ContractData } from '../models/contract.model';
import { LoginService } from './login.service';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class ContractsService {

  //TAG:string = 'ContractsService -> ';

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
      favoriteId:      "",
      iconLeft:        "",
      ownPicture:      ""
    },
    isSelected: false
  };
  observer: Observer<ContractData>;
  selectObservable: Observable<ContractData>;
  userContractsArr: ContractData[] = []; 

  private collapsers: any[] = [];

  constructor(private http: HttpClient, private loginService: LoginService,private fileUploadService:FileUploadService ) {

    this.selectObservable = new Observable((observer: Observer<ContractData>)=>{
      this.observer = observer;
      this.observer.next(this.selectedContract);
    });

    this._init();
  }

  registerObs(){
    const collapseObservable = new BehaviorSubject<boolean>(true);
    this.collapsers.push(collapseObservable);

    return collapseObservable;
  }

  unregister(collapseObservable): void {
    const index = this.collapsers.indexOf(collapseObservable);
    if (index > -1) {
      this.collapsers.splice(index, 1);
    }
  }
  
  resetAllObs() {
    this.collapsers.forEach((collapseObservable) => {
      collapseObservable.next(true);
    });
  }

  _init(){

    this.getContracts().subscribe({
      next: (resp) => {

      },
      error: (e) => {
        //console.log('Error in fetching contracts ->'+e);
        
      },
      complete: () => {
        // console.info('complete')
      }
    });
  }

  emitSelectedContract(contract:ContractData){
    this.selectedContract = contract;
    // this.observer.next(contract);
  }


  getContracts() {
    return this.http.get(environment.baseUrl + '/api/v1/contracts',{
            headers: new HttpHeaders({
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
        }).pipe(
          tap({
            next:(resp)=>{
              this.userContractsArr = [];
              
              if(Array.isArray(resp)){
                let index: number = 0;
      
                for(let item of resp){
                  if(item['docs'] === undefined){
                    item['docs'] = [];
                  }
                  let contract: ContractData = {
                    id: index,
                    details: {
                      Amsidnr:         item['Amsidnr'],
                      BranchSekretaer: item['BranchSekretaer'],
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
                      favoriteId:      item['favoriteId'],
                      iconLeft:        item['iconLeft'],
                      ownPicture:      item['ownPicture']
                    },
                    isSelected: false,
                    swipedLeft: false
                  };
                  this.userContractsArr.push(contract);
                  
                  index++;
                }
                
                //sort by BranchSekretaer
                this.userContractsArr.sort((a,b) =>a.details.BranchSekretaer.localeCompare(b.details.BranchSekretaer));

                //remove duplicate contracts from list
                this.userContractsArr = this.removeDuplicates(this.userContractsArr);

             } else {
              //invalid token
      
             }
              
            },
            error:(error: any)=>{

              if(error instanceof HttpErrorResponse){
                //console.log(error.status);

                //Invalid Token or Unauthorised request
                if(error.status == 401){
                  // this.loginService.isAuthenticated = false;

                  this.loginService.resetAuthToken();
                }
              }

            }
          }));
    }

    removeDuplicates(arr) {
      let unique = [];
      let contractExists: boolean = false;
      arr.forEach(element => {
          contractExists = false;
          for(let i=0; i<unique.length; i++ ){
              if(unique[i].details.Amsidnr == element.details.Amsidnr){
                contractExists = true;
              }
          }
          if(!contractExists){
            unique.push(element);
          }
      });
      return unique;
    }

  getContractDetails(Amsidnr: string){
    let url = environment.baseUrl + '/api/v1/contracts/'+Amsidnr;
    
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
                BranchSekretaer: resp['BranchSekretaer'],
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
                favoriteId:      resp['favoriteId'],
                iconLeft:        resp['iconLeft'],
                ownPicture:      resp['ownPicture']
              },
              isSelected:        true
            };

            this.selectedContract = contract;
          },
          error:(error: any)=>{

            if(error instanceof HttpErrorResponse){
              //Invalid Token or Unauthorised request
              if(error.status == 401){
                this.loginService.resetAuthToken();
              }
            }
            
          }
        }));
  }

  makeContractFavourite(contractId){
    let data = '{"type": "contract","item_identifier": "'+contractId+'"}';

    return this.http.post(environment.baseUrl + '/api/v1/sekretaer/favorites', data, {
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
              this.loginService.resetAuthToken();
            }
          }
          
        } 
      })
    );
  }

  deleteContractFavourite(contractId){
    let url = environment.baseUrl + '/api/v1/sekretaer/favorites/'+contractId;
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
              this.loginService.resetAuthToken();
            }
          }
          
        } 
      })
    );
  }


  addNewContract(formData:FormData){
  
    let url = environment.baseUrl + '/api/v1/contracts';

  
    let document:FileNameData = {doc_file:null};

    let postData:any = {};

    formData.forEach((value,key)=>{
      postData[key] = value;

    });
    
    document.doc_file = postData.File;
    //console.log(this.TAG + postData.File);

    return this.http.post(url , postData, {
      headers:new HttpHeaders({
        'accept': 'application/json',
        'Content-Type': 'application/json',
      }),   
    }).pipe(
      tap({
        next:(resp)=>{

          let contract: ContractData = {
            id:                resp['Amsidnr'],
            details: {
              Amsidnr:         resp['Amsidnr'],
              BranchSekretaer: resp['BranchSekretaer'],
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
              favoriteId:      resp['favoriteId'],
              iconLeft:        resp['iconLeft'],
              ownPicture:      resp['ownPicture']
            },
            isSelected:        true
          };

          // this.emitSelectedFolder(contract);
          if (document !== null && document !== undefined){
            
            //console.log(this.TAG + document);
            this.fileUploadService.addContractFile(document,contract.details.Amsidnr).subscribe({
              next:(resp)=>{
                //console.log(resp);
  
              },
              error:()=>{
  
              },
              complete:()=>{
  
              },
            });
          }

          
        },
        error:(error: any) =>{
            if(error instanceof HttpErrorResponse){
              //Invalid token or Unauthorised request

              if(error.status == 401){
                this.loginService.resetAuthToken();
              }
            }
        }
      })
    );
  }

}