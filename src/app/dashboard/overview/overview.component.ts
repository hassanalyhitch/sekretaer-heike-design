import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContractData } from '../../models/contract.model';
import { ContractsService } from '../../services/contracts.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  favArr:ContractData[] = [];
  allContractsArr:ContractData[] = [];

  constructor(private router:Router, private contractService: ContractsService) { }

  ngOnInit() {
    this.contractService.getContracts().subscribe({
      complete: ()=>{
        this.allContractsArr = this.contractService.userContractsArr;
        this.allContractsArr.forEach((contract)=>{
          
          if(contract.details.isFav === 1 || contract.details.isFav === '1' ){
            this.favArr.push(contract);
          }
        });
      }
    });
    
  }

}