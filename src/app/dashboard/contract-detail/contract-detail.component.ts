import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ContractData } from '../../models/contract.model';
import { DocumentData } from '../../models/document.model';
import { ContractsService } from '../../services/contracts.service';

@Component({
  selector: 'app-contract-detail',
  templateUrl: './contract-detail.component.html',
  styleUrls: ['./contract-detail.component.css']
})
export class ContractDetailComponent implements OnInit, OnDestroy {

  @Input() index:string;
  hrTitle: string;
  contract: ContractData = ;
  contractSub: Subscription;

  docArr: DocumentData[] = [];

  constructor(
  private route: ActivatedRoute,
  private router: Router, private translate:TranslateService, private contractService: ContractsService) {

    this.contract.details.Amsidnr = "";
    this.contract.details.CustomerAmsidnr = "";
    this.contract.details.InsuranceId =  "";
    this.contract.details.ContractNumber =  "";
    this.contract.details.Company =  "";
    this.contract.details.StartDate =  "";
    this.contract.details.EndDate =  "";
    this.contract.details.YearlyPayment =  "";
    this.contract.details.Paymethod =  "";
    this.contract.details.Branch =  "";
    this.contract.details.Risk = "";

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
                console.log(this.docArr.length);
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

}