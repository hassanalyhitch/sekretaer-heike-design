import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ContractData } from '../../models/contract.model';
import { ContractsService } from '../../services/contracts.service';

@Component({
  selector: 'app-contract-detail',
  templateUrl: './contract-detail.component.html',
  styleUrls: ['./contract-detail.component.css']
})
export class ContractDetailComponent implements OnInit, OnDestroy {

  @Input() index:string;
  hrTitle: string;
  contract: ContractData;
  contractSub: Subscription;

  constructor(
  private route: ActivatedRoute,
  private router: Router, private translate:TranslateService, private contractService: ContractsService) {

    this.hrTitle = this.translate.instant('insurance.detail.hrtitle');
  
    this.contractSub = contractService.selectObservable.subscribe({
      next:(contract)=>{
        this.contract = contract;
        contractService.getContractDetails(this.contract.details.Amsidnr).subscribe({
          next:(resp)=>{
              console.log(resp);
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