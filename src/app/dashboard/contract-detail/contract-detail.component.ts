import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ContractData } from '../../models/contract.model';
import { DocumentData } from '../../models/document.model';
import { ContractsService } from '../../services/contracts.service';
import { RenameContractComponent } from '../rename-contract/rename-contract.component';

@Component({
  selector: 'app-contract-detail',
  templateUrl: './contract-detail.component.html',
  styleUrls: ['./contract-detail.component.css']
})
export class ContractDetailComponent implements OnInit, OnDestroy {

  @Input() index:string;
  hrTitle: string;
  contract: ContractData = <ContractData>{
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
      tarif: "",
      productSek: "",
      isFav: 0
    },
    isSelected: false
  };
  contractSub: Subscription;

  docArr: DocumentData[] = [];

  constructor(
  private route: ActivatedRoute,private matDialog: MatDialog,
  private router: Router, private translate:TranslateService, private contractService: ContractsService) {

    this.hrTitle = this.translate.instant('insurance.detail.hrtitle');
  
    this.contractSub = contractService.selectObservable.subscribe({
      next:(contract)=>{
        this.contract = contract;
        contractService.getContractDetails(this.contract.details.Amsidnr).subscribe({
          next:(resp:any)=>{
              if(resp.hasOwnProperty('docs')){
                for(let i=0; i<resp.docs.length; i++){
                  this.docArr.push(resp.docs[i]);
                }
                // console.log(this.docArr.length);
              }
          }
        });
      }
    });
  }

  ngOnInit() {
    this.index = this.route.snapshot.paramMap.get('id');

    const wholeDocTemplate = document.getElementsByClassName('_card-content').item(0) as HTMLElement | null;
    if (wholeDocTemplate != null) {
      document.getElementById("docu-hr").setAttribute('data-content', this.hrTitle);
    } 
  }

  ngOnDestroy(){
    this.contractSub.unsubscribe();
  }
  
  openModal(file) {
    const dialogConfig = new MatDialogConfig();
    // let passdata:string = '{"fileName": "'+this.file.name+'","fileUrl": "'+this.file.fileUrl+'"}';
    let passdata:string = '{"contractName": "'+file.details.name+'","contractId": "'+file.details.Amsidnr+'"}';
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = 'renamecontract-modal-component';
    // dialogConfig.height = '80%';
    // dialogConfig.width = '90%';
    dialogConfig.data = passdata;
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(RenameContractComponent, dialogConfig);
  }

  markFav(contract){
    this.contractService.makeContractFavourite(contract.details.Amsidnr).subscribe();
  }
  unmarkFav(contract){
    this.contractService.deleteContractFavourite(contract.details.Amsidnr).subscribe();
  }

}